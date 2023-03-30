import "reflect-metadata";
import { DataSource } from "typeorm";

import { Book } from "../entity/Book";
import { User } from "../entity/User";
import "dotenv/config";

export const AppDataSource = new DataSource({
  type: "sqlite",
  database: ":memory:",
  synchronize: false,
  logging: false,
  entities: [User, Book],
});
