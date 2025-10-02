import express from "express";
import cors from "cors";
import questsRouter from "./routes/quests";
import reviewsRouter from "./routes/reviews";
import usersRouter from "./routes/users";
import mypageRouter from "./routes/mypage";
import adminUsersRouter from "./routes/adminUsers";

// .env 読み込み
import dotenv from "dotenv";
dotenv.config();

// Firebase Admin SDK 初期化
import { initializeApp, getApps, cert } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";

// Firebase Admin SDK が既に初期化されていない場合のみ初期化
if (getApps().length === 0) {
  try {
    // 環境変数からFirebase認証情報を取得
    const serviceAccount = {
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
    };

    if (
      serviceAccount.projectId &&
      serviceAccount.clientEmail &&
      serviceAccount.privateKey
    ) {
      initializeApp({
        credential: cert(serviceAccount),
      });
      console.log("Firebase Admin SDK initialized successfully");
    } else {
      console.warn(
        "Firebase Admin SDK credentials not found. Firebase features will be disabled."
      );
    }
  } catch (error) {
    console.error("Failed to initialize Firebase Admin SDK:", error);
  }
}

const app = express();
const PORT = process.env.PORT || 3001;

// 環境変数からフロントエンド URL を取得
const frontendBaseUrl =
  process.env.FRONTEND_BASE_URL || "http://localhost:3000";

// CORS 設定
app.use(
  cors({
    origin: frontendBaseUrl, // 環境変数から取得
    credentials: true, // CookieやAuthorizationヘッダーを許可
  })
);

app.use(express.json());

// ルーティング
app.use("/api/quests", questsRouter);
app.use("/api/reviews", reviewsRouter);
app.use("/api/users", usersRouter);
app.use("/api/mypage", mypageRouter);
app.use("/api/admin/users", adminUsersRouter);

// サーバー起動
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
