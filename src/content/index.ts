import express, { Router } from "express";
import { Request, Response } from "express";

import { AppDataSource } from "../DataSource";
import { Book } from "../entity/Book";
import { User } from "../entity/User";
import { checkJwtHasPermission } from "../middleware/checkJwtHasPermission";

const router: Router = express.Router();

// DB接続
AppDataSource.initialize()
  .then(() => {
    console.log("DataSource initialized!!");
  })
  .catch((error: Error) => {
    console.log(error);
  });

// GETリクエスト（指定ユーザーに紐づいている本の一覧の取得）
router.get(
  "/:userId",
  checkJwtHasPermission,
  async (req: Request, res: Response) => {
    try {
      const user: User | null = await AppDataSource.getRepository(User)
        .createQueryBuilder("user")
        .leftJoinAndSelect("user.books", "book")
        .where("user.id = :id", { id: req.params.userId })
        .getOneOrFail();
      res.status(200).json(user.books);
    } catch (error) {
      res.status(400).json(null);
    }
  }
);

// GETリクエスト（指定ユーザーに紐づいている本の中からidを指定して本を取得）
router.get(
  "/:userId/:bookId",
  checkJwtHasPermission,
  async (req: Request, res: Response) => {
    try {
      const book: Book | null = await AppDataSource.getRepository(Book)
        .createQueryBuilder("book")
        .where("book.id = :id", { id: req.params.bookId })
        .getOneOrFail();
      res.status(200).json(book);
    } catch (error: unknown) {
      res.status(400).json(null);
    }
  }
);

// POSTリクエスト（指定ユーザーの本の新規登録）
router.post(
  "/:userId",
  checkJwtHasPermission,
  async (req: Request, res: Response) => {
    try {
      const BookToInsert: Book = new Book();
      if (!Object.prototype.hasOwnProperty.call(req.body, "title"))
        BookToInsert.title = "タイトル";
      else BookToInsert.title = req.body.title;
      if (!Object.prototype.hasOwnProperty.call(req.body, "content"))
        BookToInsert.content = "コンテンツ";
      else BookToInsert.content = req.body.content;
      BookToInsert.userId = parseInt(req.params.userId);
      await AppDataSource.getRepository(Book)
        .createQueryBuilder("book")
        .insert()
        .into(Book)
        .values(BookToInsert)
        .execute();
      res.status(200).json(BookToInsert);
    } catch (error: unknown) {
      res.status(400).json(error);
    }
  }
);

// PUTリクエスト（指定ユーザーの本の更新）
router.put(
  "/:userId/:bookId",
  checkJwtHasPermission,
  async (req: Request, res: Response) => {
    try {
      if (
        !Object.prototype.hasOwnProperty.call(req.body, "title") &&
        !Object.prototype.hasOwnProperty.call(req.body, "content") === false
      )
        throw new Error();
      else {
        const BookToUpdate: Book = new Book();
        BookToUpdate.id = parseInt(req.params.bookId);
        if (Object.prototype.hasOwnProperty.call(req.body, "title"))
          BookToUpdate.title = req.body.title;
        if (Object.prototype.hasOwnProperty.call(req.body, "content"))
          BookToUpdate.content = req.body.content;
        BookToUpdate.userId = parseInt(req.params.userId);
        await AppDataSource.getRepository(Book)
          .createQueryBuilder("book")
          .update(Book)
          .set(BookToUpdate)
          .where("book.id = :id", { id: parseInt(req.params.bookId) })
          .execute();
        res.status(200).json(BookToUpdate);
      }
    } catch (error: unknown) {
      res.status(400).json(null);
    }
  }
);

// DELETEリクエスト（指定ユーザーの本の削除）
router.delete(
  "/:userId/:bookId",
  checkJwtHasPermission,
  async (req: Request, res: Response) => {
    try {
      // 本idが存在するか確認
      await AppDataSource.getRepository(Book)
        .createQueryBuilder("book")
        .where("book.id = :id", { id: req.params.bookId })
        .getOneOrFail();

      // 削除
      await AppDataSource.getRepository(Book)
        .createQueryBuilder("book")
        .delete()
        .from(Book)
        .where("book.id = :id", { id: parseInt(req.params.bookId) })
        .execute();
      res.status(200).json({});
    } catch (error: unknown) {
      res.status(400).json(null);
    }
  }
);

export default router;
