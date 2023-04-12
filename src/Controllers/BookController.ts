import { Request, Response } from "express";
import { validationResult } from "express-validator";

import {
  deleteBook,
  getBookById,
  insertBook,
  updateBook,
} from "../models/BookModel";
import { getUserById } from "../models/UserModel";
import { RequestError } from "../types/RequestError";

// 指定ユーザーに紐づいている本の一覧を取得する
export const getAllUserBooks = async (req: Request, res: Response) => {
  try {
    // バリデーション
    const errors = validationResult(req);
    if(!errors.isEmpty()) throw new RequestError();
    const userId: number = parseInt(req.params.userId);
    const user = await getUserById(userId);
    res.status(200).json({data: user.books, message:"本の一覧の取得に成功しました。"});
  } catch (error: unknown) {
    if (error instanceof RequestError) {
      res.status(400).json({data:null, message:error.message});
      return;
    }
    res.status(500).json({data:null, message:"ServerError: サーバーでエラーが発生しました。"});
  }
};

// 指定ユーザーに紐づいている本の中から本idを指定して本を取得する
export const getUserBookById = async (req: Request, res: Response) => {
  try {
    // バリデーション
    const errors = validationResult(req);
    if(!errors.isEmpty()) throw new RequestError();
    const bookId: number = parseInt(req.params.bookId);
    const book = await getBookById(bookId);
    res.status(200).json({data: book, message:"本の取得に成功しました。"});
  } catch (error: unknown) {
    if (error instanceof RequestError) {
      res.status(400).json({data:null, message:error.message});
      return;
    }
    res.status(500).json({data:null, message:"ServerError: サーバーでエラーが発生しました。"});
    return;
  }
};

// 指定ユーザーの本を新規登録する
export const registerUserBook = async (req: Request, res: Response) => {
  try {
    // バリデーション
    const errors = validationResult(req);
    if(!errors.isEmpty()) throw new RequestError();
    const userId: number = parseInt(req.params.userId);
    const title: string = req.body.title;
    const content: string = req.body.content;
    const book = await insertBook(userId, title, content);
    res.status(200).json({data: book, message:"本の登録に成功しました。"});
  } catch (error: unknown) {
    if (error instanceof RequestError) {
      res.status(400).json({data:null, message:error.message});
      return;
    }
    res.status(500).json({data:null, message:"ServerError: サーバーでエラーが発生しました。"});
    return;
  }
};

// 指定ユーザーの本を更新する
export const updateUserBook = async (req: Request, res: Response) => {
  try {
    // バリデーション
    const errors = validationResult(req);
    if(!errors.isEmpty()) throw new RequestError();
    const userId: number = parseInt(req.params.userId);
    const bookId: number = parseInt(req.params.bookId);
    const title: string = req.body.title;
    const content: string = req.body.content;
    if (!title && !content) throw new Error();

    // 本が存在するか確認
    const isBook = await getBookById(bookId);
    if (isBook === null) throw new Error();

    // 更新
    const book = await updateBook(userId, bookId, title, content);
    res.status(200).json({data:book, message:"本の更新に成功しました。"});
  } catch (error: unknown) {
    if (error instanceof RequestError) {
      res.status(400).json({data:null, message:error.message});
      return;
    }
    res.status(500).json({data:null, message:"ServerError: サーバーでエラーが発生しました。"});
    return;
  }
};

// 指定ユーザーの本を削除する
export const deleteUserBook = async (req: Request, res: Response) => {
  try {
    // バリデーション
    const errors = validationResult(req);
    if(!errors.isEmpty()) throw new RequestError();
    const bookId: number = parseInt(req.params.bookId);

    // 本が存在するか確認
    const isBook = await getBookById(bookId);
    if (isBook === null) throw new Error();

    // 削除
    await deleteBook(bookId);
    res.status(200).json({data:{}, message:"本の削除に成功しました。"});
  } catch (error: unknown) {
    if (error instanceof RequestError) {
      res.status(400).json({data:null, message:error.message});
      return;
    }
    res.status(500).json({data:null, message:"ServerError: サーバーでエラーが発生しました。"});
    return;
  }
};
