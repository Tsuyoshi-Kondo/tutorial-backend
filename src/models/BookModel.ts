import { AppDataSource } from "../DataSource";
import { Book } from "../entity/Book";

// 本IDをキーとしてBookテーブルから本を検索する
export const getBookById = async (id: number) => {
  try {
    const book = await AppDataSource.getRepository(Book)
      .createQueryBuilder("book")
      .where("book.id = :id", { id: id })
      .getOneOrFail();
    return book;
  } catch (error: unknown) {
    throw new Error();
  }
};

// 本を新規登録する
export const insertBook = async (
  userId: number,
  title = "タイトル",
  content = "コンテンツ"
) => {
  try {
    const BookToInsert: Book = new Book();
    BookToInsert.title = title;
    BookToInsert.content = content;
    BookToInsert.userId = userId;
    await AppDataSource.getRepository(Book)
      .createQueryBuilder("book")
      .insert()
      .into(Book)
      .values(BookToInsert)
      .execute();
    return BookToInsert;
  } catch (error: unknown) {
    throw new Error();
  }
};

// 本を更新する
export const updateBook = async (
  userId: number,
  bookId: number,
  title?: string,
  content?: string
) => {
  try {
    const BookToUpdate: Book = new Book();
    BookToUpdate.id = bookId;
    if (title) BookToUpdate.title = title;
    if (content) BookToUpdate.content = content;
    BookToUpdate.userId = userId;
    await AppDataSource.getRepository(Book)
      .createQueryBuilder("book")
      .update(Book)
      .set(BookToUpdate)
      .where("book.id = :id", { id: bookId })
      .execute();
    return BookToUpdate;
  } catch (error: unknown) {
    throw new Error();
  }
};

// 本を削除する
export const deleteBook = async (bookId: number) => {
  try {
    await AppDataSource.getRepository(Book)
      .createQueryBuilder("book")
      .delete()
      .from(Book)
      .where("book.id = :id", { id: bookId })
      .execute();
    return {};
  } catch (error: unknown) {
    throw new Error();
  }
};
