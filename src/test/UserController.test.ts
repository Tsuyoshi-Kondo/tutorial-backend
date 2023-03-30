import { Request } from "express";

import  * as UserController from "../Controllers/UserController";
import { User } from "../entity/User";
import * as JWTManager from "../middleware/JWTManager";
import * as PasswordManager from "../middleware/PasswordManager";
import * as UserModel from "../models/UserModel";

// テスト対象がimportしている関数をモック化
jest.mock("../models/UserModel");
jest.mock("../middleware/PasswordManager");
jest.mock("../middleware/JWTManager");
const UserModelMock = UserModel as jest.Mocked<typeof UserModel>;
const PasswordManagerMock = PasswordManager as jest.Mocked<typeof PasswordManager>;
const JWTManagerMock = JWTManager as jest.Mocked<typeof JWTManager>;

// テスト対象が受け取るリクエストボディの中身用
const email = "aaa@gmail,com";
const password = "123456";

describe("UserControllerのテスト", () => {
  test("useRegister関数のテスト(ユーザー情報（Email・パスワード）をリクエストから取り出して、HTTPレスポンスコード200・ユーザーID・Emailを返す)",
  async () => {
    // registerUserのモックの返り値
    const user: User = {
      id: 1,
      email,
      password,
      books: [],
    }

    // 関数モックの返り値を設定
    UserModelMock.getUserByEmail.mockImplementation(()=>Promise.resolve(null));
    PasswordManagerMock.getHashedPassword.mockImplementation(()=>Promise.resolve("HashedPassword"));
    UserModelMock.registerUser.mockImplementation(()=>Promise.resolve(user));

    // テスト対象が受け取るリクエストボディ
    const req = {
      body: {
        email,
        password,
      }
    } as Request

    // ExpressのResponseクラスのモック
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    } as any

    // テスト対象を実行
    await UserController.userRegister(req, res);

    expect(res.status.mock.calls[0][0]).toBe(200);
    expect(res.json.mock.calls[0][0]).toEqual({id:1,email:email});
  });

  test("userLogin関数のテスト(ユーザー情報（Email・パスワード）をリクエストから取り出して、HTTPレスポンスコード200・ユーザーID・Email・JWTを返す)",
    async () => {

      // getUserByEmailのモックの返り値
      const user: User = {
        id: 1,
        email,
        password,
        books: [],
      }

      // 関数モックの返り値を設定
      UserModelMock.getUserByEmail.mockImplementation(()=>Promise.resolve(user));
      PasswordManagerMock.isMatchPassword.mockImplementation(()=>Promise.resolve(true));
      JWTManagerMock.issuanceToken.mockImplementation(()=>"token");

      // テスト対象が受け取るリクエストボディ
    const req = {
      body: {
        email,
        password,
      }
    } as Request

    // ExpressのResponseクラスのモック
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    } as any

    // テスト対象を実行
    await UserController.userLogin(req, res);

    // res.status.mock.calls[n][m]->n番目の引数がm回目の呼び出しで設定された値を返す
    expect(res.status.mock.calls[0][0]).toBe(200);
    expect(res.json.mock.calls[0][0]).toEqual({id:1,email:email,token:"token"});
  });
})
