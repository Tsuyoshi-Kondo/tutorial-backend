import express, { Router } from "express";

import {
  deleteUserBook,
  getAllUserBooks,
  getUserBookById,
  registerUserBook,
  updateUserBook,
} from "../Controllers/BookController";
import { checkJwtHasPermission } from "../middleware/checkJwtHasPermission";

const router: Router = express.Router();

// GETリクエスト（指定ユーザーに紐づいている本の一覧の取得）
router.get("/:userId", checkJwtHasPermission, getAllUserBooks);

// GETリクエスト（指定ユーザーに紐づいている本の中からidを指定して本を取得）
router.get("/:userId/:bookId", checkJwtHasPermission, getUserBookById);

// POSTリクエスト（指定ユーザーの本の新規登録）
router.post("/:userId", checkJwtHasPermission, registerUserBook);

// PUTリクエスト（指定ユーザーの本の更新）
router.put("/:userId/:bookId", checkJwtHasPermission, updateUserBook);

// DELETEリクエスト（指定ユーザーの本の削除）
router.delete("/:userId/:bookId", checkJwtHasPermission, deleteUserBook);

export default router;
