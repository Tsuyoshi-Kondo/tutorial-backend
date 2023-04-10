import { Request, Response } from "express";
import { validationResult } from "express-validator";

import { issuanceToken } from "../middleware/JWTManager";
import {
  getHashedPassword,
  isMatchPassword,
} from "../middleware/PasswordManager";
import { getUserByEmail, registerUser } from "../models/UserModel";
import { RequestError } from "../types/RequestError";

// ユーザーを新規登録する
export const userRegister = async (req: Request, res: Response) => {
  try {
    // バリデーション
    const errors = validationResult(req);
    if(!errors.isEmpty()) throw new RequestError();
    const email: string = req.body.email;
    const password: string = req.body.password;

    // DBにユーザーが存在しているか確認->存在していなければOK
    const user = await getUserByEmail(email);
    if (user !== null) throw new Error();

    // パスワードの暗号化
    const hashedPassword: string = await getHashedPassword(password);

    // DBにユーザーを登録
    const newUser = await registerUser(email, hashedPassword);
    res.status(200).json({data:{ id: newUser.id, email: newUser.email }, message:"ユーザーの新規登録に成功しました。"});
  }
  catch (error: unknown) {
    if (error instanceof RequestError) {
      res.status(400).json({data:null, message:error.message});
      return;
    }
    res.status(500).json({data:null, message:"ServerError: サーバーでエラーが発生しました。"});
  }
};

// ログインする
export const userLogin = async (req: Request, res: Response) => {
  try {
    // バリデーション
    const errors = validationResult(req);
    if(!errors.isEmpty()) throw new RequestError();
    const email: string = req.body.email;
    const password: string = req.body.password;
    const secretKey: string = process.env.SECRET_KEY!;

    // ユーザーがDBに存在するか確認->存在していたらOK
    const user = await getUserByEmail(email);
    if (user === null) throw new Error();

    // パスワードを複合して照合する
    const isMatchFlag = await isMatchPassword(password, user.password);
    if (!isMatchFlag) throw new Error();

    // パスワードが合っていたらJWTを発行する
    const token = issuanceToken(secretKey, user.id);

    res.status(200).json({data:{ id: user.id, email: user.email, token: token }, message:"ログインに成功しました。"});
  }
  catch (error: unknown) {
    if (error instanceof RequestError) {
      res.status(400).json({data:null, message:error.message});
      return;
    }
    res.status(500).json({data:null, message:"ServerError: サーバーでエラーが発生しました。"});
  }
};
