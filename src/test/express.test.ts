import request from "supertest";

import app from "../app";
import { AppDataSource } from "../DataSource";

let user1Token: string;
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
    const res: request.Response = await request(app).post("/auth/register").send({
      email: "ccc@gmail.com",
      password: "345678",
    });
    expect(res.status).toBe(200);
  });
  test("登録済みのユーザーで新規登録を試みてエラーコードが取得できるか確認する。", async () => {
    const res: request.Response = await request(app).post("/auth/register").send({
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
    user1Token = res.body.token;
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

describe("ログイン後の機能のテスト", () => {
  test("ログインユーザーに紐づいている本の一覧を取得する。", async () => {
    const res: request.Response = await request(app).get("/content/1").set({"x-auth-token":user1Token});
    expect(res.status).toBe(200);
  });
  test("ログインしているユーザーが別のユーザーに紐づいている本の一覧取得を試みてエラーコードが取得できるか確認する。", async () => {
    const res: request.Response = await request(app).get("/content/2").set({"x-auth-token":user1Token});
    expect(res.status).toBe(400);
  });
  test("ログインユーザーに紐づける本（タイトル・内容）を新規登録する。", async () => {
    const res: request.Response = await request(app)
      .post("/content/1")
      .set({"x-auth-token":user1Token})
      .send({
        title: "タイトル4",
        content: "コンテンツ4",
      });
    expect(res.status).toBe(200);
  });
  test("ログインユーザーに紐づける本（内容のみ）を新規登録する。", async () => {
    const res: request.Response = await request(app)
      .post("/content/1")
      .set({"x-auth-token":user1Token})
      .send({
        content: "コンテンツ5",
      });
    expect(res.status).toBe(200);
  });
  test("ログインユーザーに紐づける本（タイトルのみ）を新規登録する。", async () => {
    const res: request.Response = await request(app)
      .post("/content/1")
      .set({"x-auth-token":user1Token})
      .send({
        title: "タイトル6",
      });
    expect(res.status).toBe(200);
  });
  test("ログインユーザーに紐づける本（タイトル・内容なし）を新規登録する。", async () => {
    const res: request.Response = await request(app)
      .post("/content/1")
      .set({"x-auth-token":user1Token})
    expect(res.status).toBe(200);
  });
  test("ログインしているユーザーが別のユーザーに紐づけて本を新規に登録しようとするとエラーコードが取得できるか確認する。", async () => {
    const res: request.Response = await request(app)
      .post("/content/2")
      .set({"x-auth-token":user1Token})
    expect(res.status).toBe(400);
  });
  test("ログインユーザーに紐づいている本をidで指定して取得する。", async () => {
    const res: request.Response = await request(app)
      .get("/content/1/4")
      .set({"x-auth-token":user1Token})
    expect(res.status).toBe(200);
  });
  test("DBに存在しない本idを指定して本の取得を試みてエラーコードが取得できるか確認する。", async () => {
    const res: request.Response = await request(app)
      .get("/content/1/100")
      .set({"x-auth-token":user1Token})
    expect(res.status).toBe(400);
  });
  test("ログインユーザーが別のユーザーに紐づいている本をidで指定して取得を試みてエラーコードが取得できるか確認する。", async () => {
    const res: request.Response = await request(app)
      .get("/content/2/3")
      .set({"x-auth-token":user1Token})
    expect(res.status).toBe(400);
  });
  test("ログインユーザーに紐づいている本をidで指定して更新する（タイトル・内容）。", async () => {
    const res: request.Response = await request(app)
      .put("/content/1/4")
      .set({"x-auth-token":user1Token})
      .send({
        title: "title4",
        content: "content4"
      });
    expect(res.status).toBe(200);
  });
  test("ログインユーザーに紐づいている本をidで指定して更新する（タイトルのみ）。", async () => {
    const res: request.Response = await request(app)
      .put("/content/1/5")
      .set({"x-auth-token":user1Token})
      .send({
        title: "title5",
      });
    expect(res.status).toBe(200);
  });
  test("ログインユーザーに紐づいている本をidで指定して更新する（内容のみ）。", async () => {
    const res: request.Response = await request(app)
      .put("/content/1/6")
      .set({"x-auth-token":user1Token})
      .send({
        content: "content6"
      });
    expect(res.status).toBe(200);
  });
  test("ログインユーザーに紐づいている本をidで指定して更新する（タイトル・内容なし）。", async () => {
    const res: request.Response = await request(app)
      .put("/content/1/7")
      .set({"x-auth-token":user1Token})
    expect(res.status).toBe(400);
  });
  test("ログインユーザーが別のユーザーに紐づいている本をidで指定して更新を試みてエラーコードが取得できるか確認する。", async () => {
    const res: request.Response = await request(app)
      .put("/content/2/3")
      .set({"x-auth-token":user1Token})
      .send({
        title: "title3"
      });
    expect(res.status).toBe(400);
  });
  test("DBに存在しない本idを指定して本の更新を試みてエラーコードが取得できるか確認する。", async () => {
    const res: request.Response = await request(app)
      .put("/content/1/100")
      .set({"x-auth-token":user1Token})
      .send({
        title: "title100"
      });
    expect(res.status).toBe(400);
  });
  test("ログインユーザーに紐づいている本をidで指定して削除する。", async () => {
    const res: request.Response = await request(app)
      .delete("/content/1/7")
      .set({"x-auth-token":user1Token})
    expect(res.status).toBe(200);
  });
  test("ログインユーザーが別のユーザーに紐づいている本をidで指定して削除を試みてエラーコードが取得できるか確認する。", async () => {
    const res: request.Response = await request(app)
      .delete("/content/2/3")
      .set({"x-auth-token":user1Token})
    expect(res.status).toBe(400);
  });
  test("DBに存在しない本idを指定して本の削除を試みてエラーコードが取得できるか確認する。", async () => {
    const res: request.Response = await request(app)
      .delete("/content/1/100")
      .set({"x-auth-token":user1Token})
    expect(res.status).toBe(400);
  });
});
