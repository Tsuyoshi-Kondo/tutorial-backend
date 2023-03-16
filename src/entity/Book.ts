import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";

import { User } from "./User";

@Entity()
export class Book {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  content: string;

  // 外部キー（ユーザーID）
  @Column()
  userId: number;
  @ManyToOne(() => User, (user) => user.books)
  @JoinColumn({ name: "userId" })
  user: User;
}
