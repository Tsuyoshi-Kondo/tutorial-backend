import * as JWT from "jsonwebtoken";

// JWTの発行
export const issuanceToken = (secretKey: string, userId: number) => {
  const token: string = JWT.sign(
    {
      id: userId,
    },
    secretKey,
    {
      expiresIn: "1h",
    }
  );
  return token;
};

// リクエストされたJWT文字列と共通鍵を用いてJWTの検証と読み取りを行う
export const inspectionToken = async (secretKey: string, token: string) => {
  const decodedToken = await JWT.verify(token, secretKey);
  if (typeof decodedToken === "string") throw new Error();
  return decodedToken;
};
