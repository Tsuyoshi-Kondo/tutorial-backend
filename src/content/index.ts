import express, { Router } from "express";
import { Request, Response } from "express";
import { AppDataSource } from "../DataSource";
import { Book } from "../entity/Book";

const router: Router = express.Router();

// DB接続
AppDataSource.initialize().then(() => {
    console.log("DataSource initialized!!");
}).catch((error: Error) => {
    console.log(error);
});

// GETリクエスト（記事一覧の取得）
router.get("/", async (req: Request, res: Response)  => {
    try {
        const AllBooks: Book[] = await AppDataSource.getRepository(Book).find()        
        res.status(200).json(AllBooks);
    }
    catch (error) {
        res.status(400).json(null);
    }
});

// POSTリクエスト（記事の新規作成）
router.post("/", async (req: Request, res: Response)  => {
    try {
        const newBook: Book = new Book();
        if (req.body.hasOwnProperty("title") === false) newBook.title = "タイトル";
        else newBook.title = req.body.title;
        if (req.body.hasOwnProperty("content") === false) newBook.content = "コンテンツ";
        else newBook.content = req.body.content;
        await AppDataSource.manager.save(newBook);
        res.status(200).json(newBook);
    } catch (error) {
        res.status(400).json(null);
    }
});

// GETリクエスト（idで記事の取得）
router.get("/:id", async (req: Request, res: Response)  => {
    try {
        const OneBook: Book | null = await AppDataSource.getRepository(Book).findOneBy({
            id: parseInt(req.params.id),
        });
        if (OneBook===null) throw new Error();
        res.status(200).json(OneBook);
    } catch (error) {
        res.status(400).json(null);
    }
});

// PUTリクエスト（idで記事の更新）
router.put("/:id", async (req: Request, res: Response)  => {
    try {
        const BookToUpdate: Book | null = await AppDataSource.getRepository(Book).findOneBy({
            id: parseInt(req.params.id),
        });
        BookToUpdate!.title = req.body.title;
        BookToUpdate!.content = req.body.content;
        await AppDataSource.manager.save(BookToUpdate);
        const BookToUpdateAfter: Book | null = await AppDataSource.getRepository(Book).findOneBy({
            id: parseInt(req.params.id),
        });
        res.status(200).json(BookToUpdateAfter);
    } catch (error) {
        res.status(400).json(null);
    }
})

// DELETEリクエスト（idで記事の削除）
router.delete("/:id", async (req: Request, res: Response)  => {
    try {
        const BookToRemove: Book | null = await AppDataSource.getRepository(Book).findOneBy({
            id: parseInt(req.params.id),
        });
        await AppDataSource.manager.remove(BookToRemove!);
        res.status(200).json({});
    } catch (error) {
        res.status(400).json(null);
    }
});

export default router;