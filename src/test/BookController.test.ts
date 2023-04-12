import { Request } from "express";

import  * as BookController from "../Controllers/BookController";
import { Book } from "../entity/Book";
import { User } from "../entity/User";
import * as BookModel from "../models/BookModel";
import * as UserModel from "../models/UserModel";

// テスト対象がimportしている関数をモック化
jest.mock("../models/UserModel");
jest.mock("../models/BookModel");
jest.mock("../middleware/PasswordManager");
jest.mock("../middleware/JWTManager");
const UserModelMock = UserModel as jest.Mocked<typeof UserModel>;
const BookModelMock = BookModel as jest.Mocked<typeof BookModel>;

// テストデータ用
const id = 1;
const email = "aaa@gmail,com";
const password = "123456";
const books: Book[] = [
  { id: 1, title: "タイトル1", content: "コンテンツ1", user: {id, email, password, books: []}, userId: id },
  { id: 2, title: "タイトル2", content: "コンテンツ2", user: {id, email, password, books: []}, userId: id },
];

describe("BookControllerのテスト", () => {
  test("getAllUserBooks関数のテスト(ユーザーIDをリクエストから取り出して、HTTPレスポンスコード200・本の一覧を返す)",
  async () => {
    // 関数モックの返り値用の変数
    const user: User = {
      id,
      email,
      password,
      books,
    }

    // 関数モックの返り値を設定
    UserModelMock.getUserById.mockImplementation(()=>Promise.resolve(user));

    // テスト対象の関数に渡す引数を作成
    const req = {
      params: {
      }
    } as Request;
    req.params.userId = "1";

    // テスト対象のResponseクラスのモック
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    } as any;

    // テスト対象を実行
    await BookController.getAllUserBooks(req, res);

    expect(res.status.mock.calls[0][0]).toBe(200);
    expect(res.json.mock.calls[0][0]).toEqual(books);
  });

  test("getUserBookById関数のテスト(ユーザーIDをリクエストから取り出して、HTTPレスポンスコード200・指定した本を返す)",
  async () => {
    // 関数モックの返り値を設定
    BookModelMock.getBookById.mockImplementation(()=>Promise.resolve(books[0]));

    // テスト対象の関数に渡す引数を作成
    const req = {
      params: {
      }
    } as Request;
    req.params.userId = "1";

    // テスト対象のResponseクラスのモック
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    } as any;

    // テスト対象を実行
    await BookController.getUserBookById(req, res);

    expect(res.status.mock.calls[0][0]).toBe(200);
    expect(res.json.mock.calls[0][0]).toEqual(books[0]);
  });

  test("registerUserBook関数のテスト(ユーザーID・本のタイトルと内容をリクエストから取り出して、HTTPレスポンスコード200・登録した本を返す)",
  async () => {
    // 関数モックの返り値を設定
    BookModelMock.insertBook.mockImplementation(()=>Promise.resolve(books[0]));

    // テスト対象の関数に渡す引数を作成
    const req = {
      params: {
      },
      body: {
        title: books[0].title,
        content: books[0].content,
      }
    } as Request;
    req.params.userId = "1";

    // テスト対象のResponseクラスのモック
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    } as any;

    // テスト対象を実行
    await BookController.registerUserBook(req, res);

    expect(res.status.mock.calls[0][0]).toBe(200);
    expect(res.json.mock.calls[0][0]).toEqual(books[0]);
  });

  test("updateUserBook関数のテスト(ユーザーID・本ID・本のタイトルと内容をリクエストから取り出して、HTTPレスポンスコード200・更新した本を返す)",
  async () => {
    // 関数モックの返り値を設定
    BookModelMock.getBookById.mockImplementation(()=>Promise.resolve(books[0]));
    BookModelMock.updateBook.mockImplementation(()=>Promise.resolve(books[0]));

    // テスト対象の関数に渡す引数を作成
    const req = {
      params: {
      },
      body: {
        title: books[0].title,
        content: books[0].content,
      }
    } as Request;
    req.params.userId = "1";
    req.params.bookId = "1";

    // テスト対象のResponseクラスのモック
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    } as any;

    // テスト対象を実行
    await BookController.updateUserBook(req, res);

    expect(res.status.mock.calls[0][0]).toBe(200);
    expect(res.json.mock.calls[0][0]).toEqual(books[0]);
  });

  test("deleteUserBook関数のテスト(本IDをリクエストから取り出して、HTTPレスポンスコード200・空のオブジェクトを返す)",
  async () => {
    // 関数モックの返り値を設定
    BookModelMock.getBookById.mockImplementation(()=>Promise.resolve(books[0]));
    BookModelMock.deleteBook.mockImplementation(()=>Promise.resolve({}));

    // テスト対象の関数に渡す引数を作成
    const req = {
      params: {
      },
    } as Request;
    req.params.bookId = "1";

    // テスト対象のResponseクラスのモック
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    } as any;

    // テスト対象を実行
    await BookController.deleteUserBook(req, res);

    expect(res.status.mock.calls[0][0]).toBe(200);
    expect(res.json.mock.calls[0][0]).toEqual({});
  });
})
