import {
  getHashedPassword,
  isMatchPassword,
} from "../middleware/PasswordManager";

test("暗号化したパスワードを復号して照合する。", async () => {
  const InputPassword = "123456";
  // パスワードを暗号化
  const HashedPassword = await getHashedPassword(InputPassword);

  // 複合して照合する
  const result = await isMatchPassword(InputPassword, HashedPassword);
  expect(result).toBe(true);
});
