import { Book } from "../entity/Book";
import { User } from "../entity/User";

const user1: User = {
  id: 1,
  email: "aaa@gmail.com",
  password: "$2b$10$5nFaujU6NIqLxRFc0x3Xoel9qKVa34FaGzvbUaPhFdCBM6CDdDuPa",
  books: [],
}
const user2: User = {
  id: 2,
  email: "bbb@gmail.com",
  password: "$2b$10$z85dxwj8PvKleMi2u2iUceQf9/snXcJYCmVq.pVf7Zd7hrbTbEOTS",
  books: [],
}
export const mockUserList: User[] = [user1, user2];

export const mockBookList: Book[] = [
  {
    id: 1,
    title: "タイトル1",
    content: "コンテンツ1",
    userId: 1,
    user: user1,
  },
  {
    id: 2,
    title: "タイトル2",
    content: "コンテンツ2",
    userId: 1,
    user: user1,
  },
  {
    id: 3,
    title: "タイトル3",
    content: "コンテンツ3",
    userId: 2,
    user: user2,
  }
]
