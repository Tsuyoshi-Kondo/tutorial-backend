import { AppDataSource } from "../DataSource";
import { getUserByEmail, getUserById, registerUser } from "../models/UserModel";

// テスト前にDB接続
beforeAll(async () => {
  await AppDataSource.initialize();
});

// テスト後にDB切断
afterAll(async () => {
  await AppDataSource.destroy();
});

describe("UserModelのテスト", () => {
  test("Userテーブルにユーザーを登録する", async () => {
    // テスト対象を実行する
    const res = await registerUser("ccc@gmail.com", "hashedPassword");
    expect(res).toEqual({
      id: 3,
      email: "ccc@gmail.com",
      password: "hashedPassword",
    });
  });

  test("メールアドレスをキーとしてUserテーブルからユーザーを検索する", async () => {
    // テスト対象を実行する
    const res = await getUserByEmail("aaa@gmail.com");
    expect(res).toEqual({
      id: 1,
      email: "aaa@gmail.com",
      password: "$2b$10$5nFaujU6NIqLxRFc0x3Xoel9qKVa34FaGzvbUaPhFdCBM6CDdDuPa"
    });
  });

  test("ユーザーidをキーとしてUserテーブルからユーザーを検索する", async () => {
    // テスト対象を実行する
    const res = await getUserById(1);
    expect(res).toEqual({
      id: 1,
      email: "aaa@gmail.com",
      password: "$2b$10$5nFaujU6NIqLxRFc0x3Xoel9qKVa34FaGzvbUaPhFdCBM6CDdDuPa",
      books: [
        { id: 1, title: 'タイトル1', content: 'コンテンツ1', userId: 1 },
        { id: 2, title: 'タイトル2', content: 'コンテンツ2', userId: 1 },
      ]
    });
  });
});

