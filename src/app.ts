import express, { Express } from "express";

import routerAuth from "./auth/index";
import routerContent from "./content/index";

const app: Express = express();

// JSONオブジェクトの受信設定
app.use(express.json());

// 配列側のオブジェクトの受信設定
app.use(express.urlencoded({ extended: true }));

// ルーティング
app.use("/content", routerContent);
app.use("/auth", routerAuth);

export default app;
