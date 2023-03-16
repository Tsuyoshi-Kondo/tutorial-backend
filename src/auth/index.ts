import bcrypt from "bcrypt";
import express, { Router } from "express";
import { Request, Response } from "express";
import * as JWT from "jsonwebtoken";

import { AppDataSource } from "../DataSource";
import { User } from "../entity/User";
import "dotenv/config";

const router: Router = express.Router();

// ユーザー新規登録用のAPI
router.post("/register", async (req: Request, res: Response) => {
  const email: string = req.body.email;
  const password: string = req.body.password;

  try {
    // DBにユーザーが存在しているか確認->存在していなければOK
    const user: User | null = await AppDataSource.getRepository(User).findOneBy(
      {
        email: email,
      }
    );
    if (user !== null) throw new Error();

    // パスワードの暗号化
    const hashedPassword: string = await bcrypt.hash(password, 10);

    // DBにユーザーを登録
    const newUser: User = new User();
    newUser.email = email;
    newUser.password = hashedPassword;
    await AppDataSource.manager.save(newUser);
    res.status(200).json({ id: newUser.id, email: newUser.email });
  } catch (error: unknown) {
    res.status(400).json(null);
  }
});

// ユーザーログイン用のAPI
router.post("/login", async (req: Request, res: Response) => {
  const email: string = req.body.email;
  const password: string = req.body.password;
  let secretKey: string;

  try {
    if (process.env.SECRET_KEY !== undefined)
      secretKey = process.env.SECRET_KEY;
    else throw new Error();
    // DBにユーザーが存在しているか確認->存在していればOK
    const user: User | null = await AppDataSource.getRepository(User).findOneBy(
      {
        email,
      }
    );
    if (user === null) throw new Error();

    // パスワードを複合して照合する
    const isMatch: boolean = await bcrypt.compare(password, user.password);
    if (!isMatch) throw new Error();

    // クライアントへのJWTの発行
    const token: string = await JWT.sign(
      {
        id: user.id,
      },
      secretKey,
      {
        expiresIn: "1h",
      }
    );
    res.status(200).json({ id: user.id, email: user.email, token: token });
  } catch (error: unknown) {
    res.status(400).json(null);
  }
});

export default router;
