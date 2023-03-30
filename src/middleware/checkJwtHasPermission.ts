import { Request, Response, NextFunction } from "express";

import "dotenv/config";
import { inspectionToken } from "./JWTManager";

export const checkJwtHasPermission = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.header("x-auth-token");
  if (!token) throw new Error();
  try {
    const secretKey = process.env.SECRET_KEY??"";
    // リクエストされたJWT文字列と共通鍵を用いてJWTの検証と読み取りを行う
    const decoded = await inspectionToken(secretKey, token);
    if (parseInt(decoded.id) !== parseInt(req.params.userId)) {
      throw new Error();
    }
  } catch (error: unknown) {
    res.status(400).json(null);
    return
  }
  next();
};
