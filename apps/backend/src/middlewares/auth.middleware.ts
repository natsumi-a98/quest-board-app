import { Request, Response, NextFunction } from "express";
import admin from "firebase-admin";

// Firebase Admin 初期化（まだ初期化されていない場合のみ）
if (!admin.apps.length) {
	const projectId = process.env.FIREBASE_PROJECT_ID;
	const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
	const rawPrivateKey = process.env.FIREBASE_PRIVATE_KEY;
	const privateKey = rawPrivateKey?.replace(/\\n/g, "\n");

	try {
		if (projectId && clientEmail && privateKey) {
			admin.initializeApp({
				credential: admin.credential.cert({
					projectId,
					clientEmail,
					privateKey,
				}),
			});
		} else {
			// 環境変数が不十分な場合は ADC にフォールバック
			admin.initializeApp({
				credential: admin.credential.applicationDefault(),
			});
			// 参考ログ
			console.warn(
				"[auth.middleware] Using Application Default Credentials. Set FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, FIREBASE_PRIVATE_KEY to use service account cert."
			);
		}
	} catch (e) {
		console.error("[auth.middleware] Firebase Admin initialization failed:", e);
		throw e;
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
