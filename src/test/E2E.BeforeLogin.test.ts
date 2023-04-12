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

describe("ログイン機能のテスト", () => {
  test("ユーザーを新規登録する。", async () => {
    const res: request.Response = await request(app)
      .post("/auth/register")
      .send({
        email: "ccc@gmail.com",
        password: "345678",
      });
    expect(res.status).toBe(200);
  });
  test("登録済みのユーザーで新規登録を試みてエラーコードが取得できるか確認する。", async () => {
    const res: request.Response = await request(app)
      .post("/auth/register")
      .send({
        email: "ccc@gmail.com",
        password: "345678",
      });
    expect(res.status).toBe(400);
  });
  test("ユーザーID=1のユーザーでログインする。", async () => {
    const res: request.Response = await request(app).post("/auth/login").send({
      email: "aaa@gmail.com",
      password: "123456",
    });
    expect(res.status).toBe(200);
  });
  test("間違ったEmailアドレスでログインを試みてエラーコードが取得できるか確認する。", async () => {
    const res: request.Response = await request(app).post("/auth/login").send({
      email: "0aaa@gmail.com",
      password: "123456",
    });
    expect(res.status).toBe(400);
  });
  test("間違ったパスワードでログインを試みてエラーコードが取得できるか確認する。", async () => {
    const res: request.Response = await request(app).post("/auth/login").send({
      email: "aaa@gmail.com",
      password: "0123456",
    });
    expect(res.status).toBe(400);
  });
});
