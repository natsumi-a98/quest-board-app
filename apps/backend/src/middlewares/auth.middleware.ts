import { Request, Response, NextFunction } from "express";
import admin from "../config/firebase"; // 初期化済みの Firebase Admin SDK を利用
import type { User } from "@prisma/client";
import { ROLES } from "../constants/roles";
import { logger } from "../config/logger";
import { getUserByFirebaseUidService } from "../services/userService";
import { forbidden, unauthorized, AppError } from "../utils/appError";

// Express リクエスト用の型拡張（userを付与するため）
declare global {
  namespace Express {
    interface Request {
      user?: admin.auth.DecodedIdToken;
      appUser?: User;
    }
  }
}

// 認証ミドルウェア
export const authMiddleware = async (
  req: Request,
  _res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith("Bearer ")) {
    return next(unauthorized("Unauthorized: Bearer token missing"));
  }

  const idToken = authHeader.split("Bearer ")[1];

  try {
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    req.user = decodedToken;
    next();
  } catch (error) {
    logger.warn({ err: error }, "Firebase トークンの検証に失敗しました");
    return next(unauthorized("Unauthorized: Invalid token"));
  }
};

export const requireAdmin = async (
  req: Request,
  _res: Response,
  next: NextFunction
) => {
  const firebaseUid = req.user?.uid;

  if (!firebaseUid) {
    return next(unauthorized());
  }

  try {
    const appUser = await getUserByFirebaseUidService(firebaseUid);

    if (!appUser) {
      return next(forbidden("Forbidden: user not found"));
    }

    if (appUser.role !== ROLES.ADMIN) {
      return next(forbidden("Forbidden: admin access required"));
    }

    return next();
  } catch (error) {
    logger.error({ err: error }, "管理者権限の検証に失敗しました");
    return next(
      error instanceof AppError
        ? error
        : new AppError(
            "Failed to authorize admin user",
            500,
            "ADMIN_AUTHORIZATION_FAILED"
          )
      );
  }
};
