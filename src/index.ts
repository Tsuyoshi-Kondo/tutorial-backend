import app from "./app";
import { AppDataSource } from "./DataSource";

// 3000ポートで受信
const port: number = parseInt(process.env.API_PORT || "3000");

// APIサーバ起動
app.listen(port);
console.log("Express WebApi listening on port " + port);

// DB接続
AppDataSource.initialize()
  .then(() => {
    console.log("DataSource initialized!!");
  })
  .catch((error: Error) => {
    console.log(error);
  });
