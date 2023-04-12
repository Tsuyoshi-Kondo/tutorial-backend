import { issuanceToken, inspectionToken } from "../middleware/JWTManager";

describe("JWTManagerのテスト", () => {
  test("発行したJWTを共通鍵を用いて検証する。- 正常系", async () => {
    const SecretKey = "SECRET_KEY";
    const UserId = 1;
    // JWTを発行する
    const jwt = issuanceToken(SecretKey, UserId);

    // 検証
    const decoded = await inspectionToken(SecretKey, jwt);
    expect(decoded.id).toBe(UserId);
  });
});

