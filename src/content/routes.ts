import express, { Router } from "express";
import { checkSchema } from "express-validator";

import {
  deleteUserBook,
  getAllUserBooks,
  getUserBookById,
  registerUserBook,
  updateUserBook,
} from "../Controllers/BookController";
import { checkJwtHasPermission } from "../middleware/checkJwtHasPermission";

const router: Router = express.Router();

const isJwtRule = checkSchema({
  "x-auth-token": {
    in: ["headers"],
    exists: true,
    isJWT: true,
  },
  userId: {
    in: ["params"],
    exists: true,
    isNumeric: true,
  },
});

// GETリクエスト（指定ユーザーに紐づいている本の一覧の取得）
router.get("/:userId",
  isJwtRule,
  checkJwtHasPermission,
  getAllUserBooks,
);

// GETリクエスト（指定ユーザーに紐づいている本の中からidを指定して本を取得）
router.get("/:userId/:bookId",
  isJwtRule,
  checkJwtHasPermission,
  checkSchema({
    bookId: {
      in: ["params"],
      exists: true,
      isNumeric: true,
    },
  }),
  getUserBookById
);

// POSTリクエスト（指定ユーザーの本の新規登録）
router.post("/:userId",
  isJwtRule,
  checkJwtHasPermission,
  registerUserBook,
);

// PUTリクエスト（指定ユーザーの本の更新）
router.put("/:userId/:bookId",
  isJwtRule,
  checkJwtHasPermission,
  checkSchema({
    bookId: {
      in: ["params"],
      exists: true,
      isNumeric: true,
    },
  }),
  updateUserBook
);

// DELETEリクエスト（指定ユーザーの本の削除）
router.delete("/:userId/:bookId",
  isJwtRule,
  checkJwtHasPermission,
  checkSchema({
    bookId: {
      in: ["params"],
      exists: true,
      isNumeric: true,
    },
  }),
  deleteUserBook
);

export default router;
