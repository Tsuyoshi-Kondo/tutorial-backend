import { AppDataSource } from "../DataSource";
import { deleteBook, getBookById, insertBook, updateBook } from "../models/BookModel";

// テスト前にDB接続
beforeAll(async () => {
  await AppDataSource.initialize();
});

// テスト後にDB切断
afterAll(async () => {
  await AppDataSource.destroy();
});

describe("BookModelのテスト", () => {
  test("本IDをキーとしてBookテーブルから本を検索する", async () => {
    // テスト対象を実行する
    const res = await getBookById(1);
    expect(res).toEqual({
      id: 1,
      title: "タイトル1",
      content: "コンテンツ1",
      userId: 1,
    });
  });
  test("本を新規登録して登録した本の情報を返す", async () => {
    // テスト対象を実行する
    const res = await insertBook(1, "title", "content");
    console.log(res)
    expect(res).toEqual({
      id: 4,
      title: "title",
      content: "content",
      userId: 1,
    });
  });
  test("本の情報を更新して更新した本の情報を返す", async () => {
    // テスト対象を実行する
    const res = await updateBook(1, 1, "update", "update");
    expect(res).toEqual({
      id: 1,
      title: "update",
      content: "update",
      userId: 1,
    });
  });
  test("本の情報を削除して空のオブジェクトを返す", async () => {
    // テスト対象を実行する
    const res = await deleteBook(2);
    expect(res).toEqual({});
  });
});

