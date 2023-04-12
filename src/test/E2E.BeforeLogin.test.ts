import request from "supertest";

import app from "../app";
import { AppDataSource } from "../DataSource";

// テスト前にDB接続
beforeAll(async () => {
  await AppDataSource.initialize();
});

// テスト後にDB切断
afterAll(async () => {
  await AppDataSource.destroy();
});

describe("ログイン機能のテスト正常系", () => {
  test("ユーザーを新規登録する。", async () => {
    const res: request.Response = await request(app)
      .post("/auth/register")
      .send({
        email: "ccc@gmail.com",
        password: "345678",
      });
    expect(res.status).toBe(200);
  });
  test("ユーザーID=1のユーザーでログインする。", async () => {
    const res: request.Response = await request(app).post("/auth/login").send({
      email: "aaa@gmail.com",
      password: "123456",
    });
    expect(res.status).toBe(200);
  });
});
