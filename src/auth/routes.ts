import express, { Router } from "express";
import { checkSchema } from "express-validator";

import { userLogin, userRegister } from "../Controllers/UserController";

const router: Router = express.Router();

// バリデーションルール
const validationRule = checkSchema({
  email: {
    in: ["body"],
    isEmail: true,
    exists: true,
  },
  password: {
    in: ["body"],
    exists: true,
  },
});

// ユーザー新規登録用のAPI
router.post("/register", validationRule, userRegister);

// ユーザーログイン用のAPI
router.post("/login", validationRule, userLogin,);

export default router;
