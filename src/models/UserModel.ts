import { AppDataSource } from "../DataSource";
import { User } from "../entity/User";

// Userテーブルにユーザーを登録する
export const registerUser = async (email: string, hashedPassword: string) => {
  try {
    const newUser: User = new User();
    newUser.email = email;
    newUser.password = hashedPassword;
    await AppDataSource.manager.save(newUser);
    return newUser;
  } catch (error: unknown) {
    throw new Error();
  }
};

// メールアドレスをキーとしてUserテーブルからユーザーを検索する
export const getUserByEmail = async (email: string) => {
  try {
    const user: User | null = await AppDataSource.getRepository(User).findOneBy(
      {
        email,
      }
    );
    return user;
  } catch (error: unknown) {
    throw new Error();
  }
};

// ユーザーIDをキーとしてUserテーブルからユーザーを検索する
export const getUserById = async (id: number) => {
  try {
    const user = await AppDataSource.getRepository(User)
      .createQueryBuilder("user")
      .leftJoinAndSelect("user.books", "book")
      .where("user.id = :id", { id: id })
      .getOneOrFail();
    return user;
  } catch (error: unknown) {
    throw new Error();
  }
};
