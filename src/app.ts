import express, { Express } from "express";

import routerAuth from "./auth/routes";
import routerContent from "./content/routes";

const app: Express = express();

// JSONオブジェクトの受信設定
app.use(express.json());

// 配列側のオブジェクトの受信設定
app.use(express.urlencoded({ extended: true }));

// ルーティング
app.use("/auth", routerAuth);
app.use("/content", routerContent);

export default app;
