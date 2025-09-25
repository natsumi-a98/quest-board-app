import { Request, Response } from "express";
import { getAllUsersForAdminService } from "../services/adminUserService";

export const getAllUsersForAdmin = async (req: Request, res: Response) => {
  try {
    const users = await getAllUsersForAdminService();
    res.json(users);
  } catch (error) {
    console.error("ユーザー一覧取得エラー:", error);
    res.status(500).json({ error: "ユーザー一覧を取得できませんでした" });
  }
};
