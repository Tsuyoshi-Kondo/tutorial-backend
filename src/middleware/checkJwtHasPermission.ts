import { Request, Response, NextFunction } from "express";
import * as JWT from "jsonwebtoken";
import "dotenv/config";

export const checkJwtHasPermission = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.header("x-auth-token");
  let secretKey: string;
  if (!token) throw new Error();
  else {
    try {
      if (process.env.SECRET_KEY !== undefined)
        secretKey = process.env.SECRET_KEY;
      else throw new Error();
      // リクエストされたJWT文字列と共通鍵を用いてJWTの検証と読み取りを行う
      const decoded: string | JWT.JwtPayload = await JWT.verify(
        token,
        secretKey
      );
      if (typeof decoded !== "string") {
        if (parseInt(decoded.id) === parseInt(req.params.userId)) {
          next();
        } else throw new Error();
      } else throw new Error();
    } catch (error: unknown) {
      res.status(400).json(null);
    }
  }
};
