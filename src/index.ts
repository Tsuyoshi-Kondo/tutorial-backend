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

// 3000ポートで受信
const port: number = parseInt(process.env.API_PORT || "3000");

// APIサーバ起動
app.listen(port);
console.log("Express WebApi listening on port " + port);
