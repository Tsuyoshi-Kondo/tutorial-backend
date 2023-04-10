import { Request, Response, NextFunction } from "express";
import { validationResult } from "express-validator";

import { inspectionToken } from "./JWTManager";
import { RequestError } from "../types/RequestError";
import "dotenv/config";

export const checkJwtHasPermission = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // バリデーション
    const errors = validationResult(req);
    if(!errors.isEmpty()) throw new RequestError();

    const token = req.header("x-auth-token");
    const secretKey = process.env.SECRET_KEY!;

    // リクエストされたJWT文字列と共通鍵を用いてJWTの検証と読み取りを行う
    const decoded = await inspectionToken(secretKey, token!);

    // リクエストされたユーザーIDとJWTのユーザーIDが一致しているか確認
    if (parseInt(decoded.id) !== parseInt(req.params.userId)) {
      throw new Error();
    }
  }
  catch (error) {
    if (error instanceof RequestError) {
      res.status(400).json({data:null, message:error.message});
      return;
    }
    res.status(500).json({data:null, message:"ServerError: サーバーでエラーが発生しました。"});
    return;
  }
  next();
};
