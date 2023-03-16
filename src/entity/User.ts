import { Column, Entity, PrimaryGeneratedColumn, OneToMany } from "typeorm";

import { Book } from "./Book";

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  email: string;

  @Column()
  password: string;

  @OneToMany(() => Book, (book) => book.user)
  books: Book[];
}
