import express, { Router } from "express";

import { userLogin, userRegister } from "../Controllers/UserController";

const router: Router = express.Router();

// ユーザー新規登録用のAPI
router.post("/register", userRegister);

// ユーザーログイン用のAPI
router.post("/login", userLogin);

export default router;
