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

describe("ログイン機能のテスト-準正常系", () => {
  test("Emailアドレスの形式ではないメールアドレスで新規登録を試みてエラーコード400が取得できるか確認する。", async () => {
    const res: request.Response = await request(app)
      .post("/auth/register")
      .send({
        email: "ccc",
        password: "345678",
      });
    expect(res.status).toBe(400);
  });
  test("パスワードを入力せずに新規登録を試みてエラーコード400が取得できるか確認する。", async () => {
    const res: request.Response = await request(app)
      .post("/auth/register")
      .send({
        email: "ccc",
      });
    expect(res.status).toBe(400);
  });
  test("登録済みのユーザーで新規登録を試みてエラーコード500が取得できるか確認する。", async () => {
    const res: request.Response = await request(app)
      .post("/auth/register")
      .send({
        email: "ccc@gmail.com",
        password: "345678",
      });
    expect(res.status).toBe(500);
  });
  test("Emailアドレスの形式ではないメールアドレスでログインを試みてエラーコード400が取得できるか確認する。", async () => {
    const res: request.Response = await request(app)
      .post("/auth/login")
      .send({
        email: "aaa",
        password: "123456",
    });
    expect(res.status).toBe(400);
  });
  test("Emailの形式で入力し、かつDBに登録されていないEmailアドレスでログインを試みてエラーコード500が取得できるか確認する。", async () => {
    const res: request.Response = await request(app)
      .post("/auth/login")
      .send({
        email: "0aaa@gmail.com",
        password: "123456",
    });
    expect(res.status).toBe(500);
  });
  test("パスワードを入力せずにログインを試みてエラーコード400が取得できるか確認する。", async () => {
    const res: request.Response = await request(app)
      .post("/auth/login")
      .send({
        email: "aaa@gmail.com",
    });
    expect(res.status).toBe(400);
  });
  test("DBに登録されているものとは異なるパスワードでログインを試みてエラーコード500が取得できるか確認する。", async () => {
    const res: request.Response = await request(app)
      .post("/auth/login")
      .send({
        email: "aaa@gmail.com",
        password: "0123456",
    });
    expect(res.status).toBe(500);
  });
});
