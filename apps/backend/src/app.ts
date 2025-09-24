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

const app = express();
const PORT = process.env.PORT || 3001;

// 環境変数からフロントエンド URL を取得
const frontendBaseUrl = process.env.FRONTEND_BASE_URL || "http://localhost:3000";

// CORS 設定
app.use(
  cors({
    origin: frontendBaseUrl, // 環境変数から取得
    credentials: true,       // CookieやAuthorizationヘッダーを許可
  })
);

app.use(express.json());

// ルーティング
app.use("/api/quests", questsRouter);
app.use("/api/reviews", reviewsRouter);
app.use("/api/users", usersRouter);
app.use("/api/users", usersRouter);
app.use("/api/mypage", mypageRouter);
app.use("/api/admin/users", adminUsersRouter);

// サーバー起動
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
