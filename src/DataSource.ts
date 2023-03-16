import "reflect-metadata";
import { DataSource } from "typeorm";

import { Book } from "./entity/Book";
import { User } from "./entity/User";
import "dotenv/config";

export const AppDataSource = new DataSource({
  type: "mysql",
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || "3000"),
  username: process.env.DB_USERNANE,
  password: process.env.DB_PASSWORD,
  database: "mysql-db",
  synchronize: false,
  logging: false,
  entities: [User, Book],
  migrations: ["migrations/*.ts"],
});
