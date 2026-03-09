import { Request, Response } from "express";
import {
  getAllUsersForAdminService,
  updateUserRoleService,
} from "../services/adminUserService";
import { asyncHandler } from "../utils/asyncHandler";
import { badRequest, notFound } from "../utils/appError";

/**
 * 管理画面向けユーザー一覧を返す。
 */
export const getAllUsersForAdmin = asyncHandler(
  async (_req: Request, res: Response) => {
    const users = await getAllUsersForAdminService();
    res.json(users);
  }
);

/**
 * 指定ユーザーのロールを更新する。
 */
export const updateUserRole = asyncHandler(
  async (req: Request, res: Response) => {
    const { userId } = req.params;
    const { role } = req.body;

    if (!userId || !role) {
      throw badRequest("ユーザーIDとロールが必要です");
    }

    const userIdNumber = Number.parseInt(userId, 10);
    if (Number.isNaN(userIdNumber)) {
      throw badRequest("有効なユーザーIDを指定してください");
    }

    let updatedUser;
    try {
      updatedUser = await updateUserRoleService(userIdNumber, role);
    } catch (error) {
      if (error instanceof Error && error.message === "User not found") {
        throw notFound(error.message);
      }

      if (error instanceof Error && error.message.startsWith("Invalid role")) {
        throw badRequest(error.message);
      }

      throw error;
    }

    res.json({
      message: "ユーザーのロールが正常に更新されました",
      user: {
        id: updatedUser.id,
        name: updatedUser.name,
        email: updatedUser.email,
        role: updatedUser.role,
      },
    });
  }
);
