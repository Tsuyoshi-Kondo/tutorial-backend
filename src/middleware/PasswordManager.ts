import bcrypt from "bcrypt";

// パスワードのハッシュ化
export const getHashedPassword = async (password: string) => {
  // bcrypt.hash(ハッシュ化したい平文パスワード, ハッシュ化の回数)
  const hashedPassword: string = await bcrypt.hash(password, 10);
  return hashedPassword;
};

// 平文パスワードとDBに登録されているハッシュ値を受け取る
// 平文パスワードのハッシュ値とDBに登録されているハッシュ値を照合する
export const isMatchPassword = async (
  password: string,
  passwordFromDB: string
) => {
  const isMatch: boolean = await bcrypt.compare(password, passwordFromDB);
  return isMatch;
};
