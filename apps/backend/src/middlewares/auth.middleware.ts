import { Request, Response, NextFunction } from "express";
import admin from "firebase-admin";

// Firebase Admin 初期化（まだ初期化されていない場合のみ）
if (!admin.apps.length) {
  const projectId = process.env.FIREBASE_PROJECT_ID ?? "";
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL ?? "";
  const rawPrivateKeyEnv = process.env.FIREBASE_PRIVATE_KEY ?? "";

  // private key の形式を整える: base64 の可能性/\n エスケープ対策
  let privateKey: string | undefined = undefined;
  if (rawPrivateKeyEnv) {
    try {
      // 1) base64 として解釈を試みる（失敗時はそのまま使用）
      const maybeDecoded = Buffer.from(rawPrivateKeyEnv, "base64").toString(
        "utf8"
      );
      // base64 ではなさそうな場合は noop だが、簡易判定として BEGIN/END が含まれるか確認
      if (
        maybeDecoded.includes("-----BEGIN") &&
        maybeDecoded.includes("PRIVATE KEY-----")
      ) {
        privateKey = maybeDecoded;
      } else {
        // 2) 通常の env で \n がエスケープされているケース
        privateKey = rawPrivateKeyEnv.replace(/\\n/g, "\n");
      }
    } catch {
      // 3) デコードに失敗した場合も \n 置換で対応
      privateKey = rawPrivateKeyEnv.replace(/\\n/g, "\n");
    }
  }

  try {
    if (projectId && clientEmail && privateKey) {
      admin.initializeApp({
        credential: admin.credential.cert({
          projectId,
          clientEmail,
          privateKey,
        }),
      });
      console.log(
        "[auth.middleware] Firebase Admin SDK initialized with service account credentials"
      );
    } else {
      // 環境変数が不十分な場合は ADC にフォールバック
      admin.initializeApp({
        credential: admin.credential.applicationDefault(),
      });
      console.warn(
        "[auth.middleware] Using Application Default Credentials. Set FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, FIREBASE_PRIVATE_KEY to use service account cert."
      );
    }
  } catch (e) {
    console.error("[auth.middleware] Firebase Admin initialization failed:", e);
    // cert での初期化に失敗した場合も最終手段として ADC を試す
    try {
      if (!admin.apps.length) {
        admin.initializeApp({
          credential: admin.credential.applicationDefault(),
        });
        console.warn(
          "[auth.middleware] Falling back to Application Default Credentials after cert failure."
        );
      }
    } catch (fallbackError) {
      console.error(
        "[auth.middleware] ADC fallback also failed:",
        fallbackError
      );
      console.warn(
        "[auth.middleware] Firebase Admin SDK initialization failed. Authentication will not work properly."
      );
    }
  }
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
export const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith("Bearer ")) {
    return res
      .status(401)
      .json({ message: "Unauthorized: Bearer token missing" });
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
