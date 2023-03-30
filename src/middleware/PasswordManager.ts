import bcrypt from "bcrypt";

// パスワードの暗号化
export const getHashedPassword = async (password: string) => {
  const hashedPassword: string = await bcrypt.hash(password, 10);
  return hashedPassword;
};

// パスワードを複号して照合する
export const isMatchPassword = async (
  password: string,
  passwordFromDB: string
) => {
  const isMatch: boolean = await bcrypt.compare(password, passwordFromDB);
  return isMatch;
};
