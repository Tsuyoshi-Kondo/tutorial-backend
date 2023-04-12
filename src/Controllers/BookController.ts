import { Request, Response } from "express";

import {
  deleteBook,
  getBookById,
  insertBook,
  updateBook,
} from "../models/BookModel";
import { getUserById } from "../models/UserModel";

// 指定ユーザーに紐づいている本の一覧を取得する
export const getAllUserBooks = async (req: Request, res: Response) => {
  const userId: number = parseInt(req.params.userId);
  try {
    const user = await getUserById(userId);
    res.status(200).json(user.books);
  } catch (error) {
    res.status(400).json(null);
  }
};

// 指定ユーザーに紐づいている本の中から本idを指定して本を取得する
export const getUserBookById = async (req: Request, res: Response) => {
  const bookId: number = parseInt(req.params.bookId);
  try {
    const book = await getBookById(bookId);
    res.status(200).json(book);
  } catch (error: unknown) {
    res.status(400).json(null);
  }
};

// 指定ユーザーの本を新規登録する
export const registerUserBook = async (req: Request, res: Response) => {
  const userId: number = parseInt(req.params.userId);
  const title: string = req.body.title;
  const content: string = req.body.content;
  try {
    const book = await insertBook(userId, title, content);
    res.status(200).json(book);
  } catch (error: unknown) {
    res.status(400).json(null);
  }
};

// 指定ユーザーの本を更新する
export const updateUserBook = async (req: Request, res: Response) => {
  const userId: number = parseInt(req.params.userId);
  const bookId: number = parseInt(req.params.bookId);
  const title: string = req.body.title;
  const content: string = req.body.content;
  try {
    if (!title && !content) throw new Error();

    // 本が存在するか確認
    const isBook = await getBookById(bookId);
    if (isBook === null) throw new Error();

    // 更新
    const book = await updateBook(userId, bookId, title, content);
    res.status(200).json(book);
  } catch (error: unknown) {
    res.status(400).json(null);
  }
};

// 指定ユーザーの本を削除する
export const deleteUserBook = async (req: Request, res: Response) => {
  const bookId: number = parseInt(req.params.bookId);
  try {
    // 本が存在するか確認
    const isBook = await getBookById(bookId);
    if (isBook === null) throw new Error();

    // 削除
    await deleteBook(bookId);
    res.status(200).json({});
  } catch (error: unknown) {
    res.status(400).json(null);
  }
};
