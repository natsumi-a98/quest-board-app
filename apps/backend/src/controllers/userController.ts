import { Request, Response } from "express";
import {
  findUserByNameOrEmailService,
  getUserIdByNameOrEmailService,
} from "../services/userService";

// ユーザー検索
export const findUserByNameOrEmail = async (req: Request, res: Response) => {
  const { name, email } = req.body;

  if (!name && !email) {
    return res.status(400).json({ message: "name or email is required" });
  }

  try {
    const user = await findUserByNameOrEmailService(name || "", email || "");

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
    const userId = await getUserIdByNameOrEmailService(name || "", email || "");

    if (!userId) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ userId });
  } catch (error) {
    console.error("ユーザーID取得エラー:", error);
    res.status(500).json({ message: "Failed to get user ID" });
  }
};
