import { Request, Response } from "express";

import { issuanceToken } from "../middleware/JWTManager";
import {
  getHashedPassword,
  isMatchPassword,
} from "../middleware/PasswordManager";
import { getUserByEmail, registerUser } from "../models/UserModel";

// ユーザーを新規登録する
export const userRegister = async (req: Request, res: Response) => {
  const email: string = req.body.email;
  const password: string = req.body.password;
  try {
    // DBにユーザーが存在しているか確認->存在していなければOK
    const user = await getUserByEmail(email);
    if (user !== null) throw new Error();

    // パスワードの暗号化
    const hashedPassword: string = await getHashedPassword(password);

    // DBにユーザーを登録
    const newUser = await registerUser(email, hashedPassword);
    res.status(200).json({ id: newUser.id, email: newUser.email });
  } catch (error: unknown) {
    res.status(400).json(null);
  }
};

// ログインする
export const userLogin = async (req: Request, res: Response) => {
  const email: string = req.body.email;
  const password: string = req.body.password;
  const secretKey: string = process.env.SECRET_KEY??"";

  try {
    // ユーザーがDBに存在するか確認->存在していたらOK
    const user = await getUserByEmail(email);
    if (user === null) throw new Error();

    // パスワードを複合して照合する
    const isMatchFlag = await isMatchPassword(password, user.password);
    if (!isMatchFlag) throw new Error();

    // パスワードが合っていたらJWTを発行する
    const token = issuanceToken(secretKey, user.id);

    res.status(200).json({ id: user.id, email: user.email, token: token });
  } catch (error: unknown) {
    res.status(400).json(null);
  }
};
