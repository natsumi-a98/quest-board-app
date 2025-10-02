import { Request, Response } from "express";
import {
  getAllUsersForAdminService,
  updateUserRoleService,
} from "../services/adminUserService";

export const getAllUsersForAdmin = async (req: Request, res: Response) => {
  try {
    const users = await getAllUsersForAdminService();
    res.json(users);
  } catch (error) {
    console.error("ユーザー一覧取得エラー:", error);
    res.status(500).json({ error: "ユーザー一覧を取得できませんでした" });
  }
};

export const updateUserRole = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const { role } = req.body;

    if (!userId || !role) {
      return res.status(400).json({ error: "ユーザーIDとロールが必要です" });
    }

    const userIdNumber = parseInt(userId, 10);
    if (isNaN(userIdNumber)) {
      return res
        .status(400)
        .json({ error: "有効なユーザーIDを指定してください" });
    }

    const updatedUser = await updateUserRoleService(userIdNumber, role);

    res.json({
      message: "ユーザーのロールが正常に更新されました",
      user: {
        id: updatedUser.id,
        name: updatedUser.name,
        email: updatedUser.email,
        role: updatedUser.role,
      },
    });
  } catch (error) {
    console.error("ユーザーロール更新エラー:", error);
    const errorMessage =
      error instanceof Error
        ? error.message
        : "ユーザーロールの更新に失敗しました";
    res.status(500).json({ error: errorMessage });
  }
};
