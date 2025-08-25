import { Request, Response, NextFunction } from "express";
import admin from "firebase-admin";

// Firebase Admin 初期化（まだ初期化されていない場合のみ）
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
    }),
  });
}

// Express リクエスト用の型拡張（userを付与するため）
declare global {
  namespace Express {
    interface Request {
      user?: admin.auth.DecodedIdToken;
    }
  }
}

// 認証ミドルウェア
export const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Unauthorized: Bearer token missing" });
  }

  const idToken = authHeader.split("Bearer ")[1];

  try {
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    req.user = decodedToken; // デコードしたユーザー情報をリクエストに付与
    next();
  } catch (error) {
    console.error("Firebase token verification failed:", error);
    return res.status(401).json({ message: "Unauthorized: Invalid token" });
  }
};
