import { Request, Response } from "express";
import {
  findUserByNameOrEmailService,
  createUserService,
  getUserByFirebaseUidService,
} from "../services/userService";

// ユーザー検索
export const findUserByNameOrEmail = async (req: Request, res: Response) => {
  const { name, email } = req.body;

  if (!name && !email) {
    return res.status(400).json({ message: "name or email is required" });
  }

  try {
    const user = await findUserByNameOrEmailService(name, email);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({
      id: user.id,
      name: user.name,
      email: user.email,
    });
  } catch (error) {
    console.error("ユーザー検索エラー:", error);
    res.status(500).json({ message: "Failed to find user" });
  }
};

// ユーザーID取得
export const getUserIdByNameOrEmail = async (req: Request, res: Response) => {
  const { name, email } = req.body;

  if (!name && !email) {
    return res.status(400).json({ message: "name or email is required" });
  }

  try {
    const user = await findUserByNameOrEmailService(name, email);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ userId: user.id });
  } catch (error) {
    console.error("ユーザーID取得エラー:", error);
    res.status(500).json({ message: "Failed to get user ID" });
  }
};

// ユーザー作成（Firebase認証後）
export const createUser = async (req: Request, res: Response) => {
  // authMiddlewareで認証されたユーザー情報を取得
  const firebaseUser = req.user;

  if (!firebaseUser) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const { name, role = "user" } = req.body;

  if (!name) {
    return res.status(400).json({ message: "name is required" });
  }

  try {
    // 既存ユーザーをチェック
    const existingUser = await findUserByNameOrEmailService(
      name,
      firebaseUser.email || ""
    );

    if (existingUser) {
      return res.status(409).json({ message: "User already exists" });
    }

    // 新しいユーザーを作成
    const newUser = await createUserService({
      name,
      email: firebaseUser.email || "",
      role,
      firebaseUid: firebaseUser.uid,
    });

    res.status(201).json({
      message: "User created successfully",
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
      },
    });
  } catch (error) {
    console.error("ユーザー作成エラー:", error);
    res.status(500).json({ message: "Failed to create user" });
  }
};

// 現在のユーザー情報取得（Firebase認証後）
export const getCurrentUser = async (req: Request, res: Response) => {
  // authMiddlewareで認証されたユーザー情報を取得
  const firebaseUser = req.user;

  if (!firebaseUser) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const user = await getUserByFirebaseUidService(firebaseUser.uid);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    });
  } catch (error) {
    console.error("ユーザー情報取得エラー:", error);
    res.status(500).json({ message: "Failed to get user info" });
  }
};
