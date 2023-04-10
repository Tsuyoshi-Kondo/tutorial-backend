import request from "supertest";

import app from "../app";
import { AppDataSource } from "../DataSource";

let user1Token: "";
// テスト前にDB接続
beforeAll(async () => {
  await AppDataSource.initialize();
  const res: request.Response = await request(app).post("/auth/login").send({
    email: "aaa@gmail.com",
    password: "123456",
  });
  user1Token = res.body.data.token;
});

// テスト後にDB切断
afterAll(async () => {
  await AppDataSource.destroy();
});

describe("ログイン後の機能のテスト-準正常系", () => {
  // 本の一覧の取得---------------------↓
  test("JWTの形式ではないトークンでユーザーに紐づいている本の一覧取得を試みてエラーコード400が取得できるか確認する。", async () => {
    const res: request.Response = await request(app)
      .get("/content/1")
      .set({ "x-auth-token": "badToken" });
    expect(res.status).toBe(400);
  });
  test("リクエストヘッダーにJWTが付加されていない状態でユーザーに紐づいている本の一覧取得を試みてエラーコード400が取得できるか確認する。", async () => {
    const res: request.Response = await request(app)
      .get("/content/1")
    expect(res.status).toBe(400);
  });
  test("クエリパラメータのuseIdが数字ではない場合にユーザーに紐づいている本の一覧取得を試みてエラーコード400が取得できるか確認する。", async () => {
    const res: request.Response = await request(app)
      .get("/content/a")
    expect(res.status).toBe(400);
  });
  test("ログインしているユーザーが別のユーザーに紐づいている本の一覧取得を試みてエラーコード500が取得できるか確認する。", async () => {
    const res: request.Response = await request(app)
      .get("/content/2")
      .set({ "x-auth-token": user1Token });
    expect(res.status).toBe(500);
  });
  // 本の一覧の取得---------------------↑

  // 本の新規登録---------------------↓
  test("JWTの形式ではないトークンで別のユーザーに紐づけて本を新規に登録しようとするとエラーコード400が取得できるか確認する。", async () => {
    const res: request.Response = await request(app)
      .post("/content/2")
      .set({ "x-auth-token": "badToken" });
    expect(res.status).toBe(400);
  });
  test("リクエストヘッダーにJWTが付加されていない状態で別のユーザーに紐づけて本を新規に登録しようとするとエラーコード400が取得できるか確認する。", async () => {
    const res: request.Response = await request(app)
      .post("/content/2")
      .send({
        title: "Newタイトル",
        content: "Newコンテンツ",
      });
    expect(res.status).toBe(400);
  });
  test("クエリパラメータのuseIdが数字ではない場合に別のユーザーに紐づけて本を新規に登録しようとするとエラーコード400が取得できるか確認する。", async () => {
    const res: request.Response = await request(app)
      .post("/content/a")
      .set({ "x-auth-token": user1Token })
      .send({
        title: "Newタイトル",
        content: "Newコンテンツ",
      });
    expect(res.status).toBe(400);
  });
  test("ログインしているユーザーが別のユーザーに紐づけて本を新規に登録しようとするとエラーコード500が取得できるか確認する。", async () => {
    const res: request.Response = await request(app)
      .post("/content/2")
      .set({ "x-auth-token": user1Token })
      .send({
        title: "Newタイトル",
        content: "Newコンテンツ",
      });
    expect(res.status).toBe(500);
  });
  // 本の新規登録---------------------↑

  // 本の取得---------------------↓
  test("JWTの形式ではないトークンで本の取得を試みてエラーコード400が取得できるか確認する。", async () => {
    const res: request.Response = await request(app)
      .get("/content/1/1")
      .set({ "x-auth-token": "badToken" })
      expect(res.status).toBe(400);
  });
  test("リクエストヘッダーにJWTが付加されていない状態で本の取得を試みてエラーコード400が取得できるか確認する。", async () => {
    const res: request.Response = await request(app)
      .get("/content/1/1")
    expect(res.status).toBe(400);
  });
  test("クエリパラメータのuseIdが数字ではない場合に本の取得を試みてエラーコード400が取得できるか確認する。", async () => {
    const res: request.Response = await request(app)
      .get("/content/a/1")
      .set({ "x-auth-token": user1Token });
    expect(res.status).toBe(400);
  });
  test("クエリパラメータのbookIdが数字ではない場合に本の取得を試みてエラーコード400が取得できるか確認する。", async () => {
    const res: request.Response = await request(app)
      .get("/content/1/a")
      .set({ "x-auth-token": user1Token });
    expect(res.status).toBe(400);
  });
  test("DBに存在しない本idを指定して本の取得を試みてエラーコード500が取得できるか確認する。", async () => {
    const res: request.Response = await request(app)
      .get("/content/1/100")
      .set({ "x-auth-token": user1Token });
    expect(res.status).toBe(500);
  });
  test("ログインユーザーが別のユーザーに紐づいている本をidで指定して取得を試みてエラーコード500が取得できるか確認する。", async () => {
    const res: request.Response = await request(app)
      .get("/content/2/3")
      .set({ "x-auth-token": user1Token });
    expect(res.status).toBe(500);
  });
  // 本の取得---------------------↑

  // 本の更新---------------------↓
  test("JWTの形式ではないトークンで本の更新を試みてエラーコード400が取得できるか確認する。", async () => {
    const res: request.Response = await request(app)
      .put("/content/1/1")
      .set({ "x-auth-token": "badToken" })
      .send({
        title: "Newタイトル",
      });
    expect(res.status).toBe(400);
  });
  test("リクエストヘッダーにJWTが付加されていない状態で本の更新を試みてエラーコード400が取得できるか確認する。", async () => {
    const res: request.Response = await request(app)
      .put("/content/1/1")
      .send({
        title: "Newタイトル",
      });
    expect(res.status).toBe(400);
  });
  test("クエリパラメータのuseIdが数字ではない場合に本の更新を試みてエラーコード400が取得できるか確認する。", async () => {
    const res: request.Response = await request(app)
      .put("/content/a/1")
      .set({ "x-auth-token": user1Token })
      .send({
        title: "Newタイトル",
      });
    expect(res.status).toBe(400);
  });
  test("クエリパラメータのbookIdが数字ではない場合に本の更新を試みてエラーコード400が取得できるか確認する。", async () => {
    const res: request.Response = await request(app)
      .put("/content/1/a")
      .set({ "x-auth-token": user1Token })
      .send({
        title: "Newタイトル",
      });
    expect(res.status).toBe(400);
  });
  test("ログインユーザーに紐づいている本をidで指定して更新する（タイトル・内容なし）とエラーコード500が取得できるか確認する。", async () => {
    const res: request.Response = await request(app)
      .put("/content/1/7")
      .set({ "x-auth-token": user1Token })
    expect(res.status).toBe(500);
  });
  test("ログインユーザーが別のユーザーに紐づいている本をidで指定して更新を試みてエラーコード500が取得できるか確認する。", async () => {
    const res: request.Response = await request(app)
      .put("/content/2/3")
      .set({ "x-auth-token": user1Token })
      .send({
        title: "title3",
      });
    expect(res.status).toBe(500);
  });
  test("DBに存在しない本idを指定して本の更新を試みてエラーコードが取得できるか確認する。", async () => {
    const res: request.Response = await request(app)
      .put("/content/1/100")
      .set({ "x-auth-token": user1Token })
      .send({
        title: "title100",
      });
    expect(res.status).toBe(500);
  });
  // 本の更新---------------------↑

  // 本の削除---------------------↓
  test("JWTの形式ではないトークンで本の削除を試みてエラーコード400が取得できるか確認する。", async () => {
    const res: request.Response = await request(app)
      .delete("/content/1/1")
    expect(res.status).toBe(400);
  });
  test("リクエストヘッダーにJWTが付加されていない状態で本の削除を試みてエラーコード400が取得できるか確認する。", async () => {
    const res: request.Response = await request(app)
      .delete("/content/1/1")
    expect(res.status).toBe(400);
  });
  test("クエリパラメータのuseIdが数字ではない場合に本の削除を試みてエラーコード400が取得できるか確認する。", async () => {
    const res: request.Response = await request(app)
      .delete("/content/a/1")
      .set({ "x-auth-token": user1Token });
    expect(res.status).toBe(400);
  });
  test("クエリパラメータのbookIdが数字ではない場合に本の削除を試みてエラーコード400が取得できるか確認する。", async () => {
    const res: request.Response = await request(app)
      .delete("/content/1/a")
      .set({ "x-auth-token": user1Token });
    expect(res.status).toBe(400);
  });
  test("ログインユーザーに紐づいている本をidで指定して削除するとエラーコード500が取得できるか確認する。", async () => {
    const res: request.Response = await request(app)
      .delete("/content/1/7")
      .set({ "x-auth-token": user1Token });
    expect(res.status).toBe(500);
  });
  test("ログインユーザーが別のユーザーに紐づいている本をidで指定して削除を試みてエラーコード500が取得できるか確認する。", async () => {
    const res: request.Response = await request(app)
      .delete("/content/2/3")
      .set({ "x-auth-token": user1Token });
    expect(res.status).toBe(500);
  });
  test("DBに存在しない本idを指定して本の削除を試みてエラーコードが取得できるか確認する。", async () => {
    const res: request.Response = await request(app)
      .delete("/content/1/100")
      .set({ "x-auth-token": user1Token });
    expect(res.status).toBe(500);
  });
  // 本の削除---------------------↑
});
