import "./config/firebase"; // Firebase Admin SDK 初期化（副作用import）
import express from "express";
import cors from "cors";
import helmet from "helmet";
import questsRouter from "./routes/quests";
import reviewsRouter from "./routes/reviews";
import usersRouter from "./routes/users";
import mypageRouter from "./routes/mypage";
import adminUsersRouter from "./routes/adminUsers";
import { errorHandler } from "./middlewares/errorHandler";

const app = express();
const PORT = process.env.PORT || 3001;

const frontendBaseUrl =
  process.env.FRONTEND_BASE_URL || "http://localhost:3000";

app.use(
  helmet({
    contentSecurityPolicy: false, // Next.js のインラインスクリプトと競合するため無効化
  })
);

// CORS 設定
app.use(
  cors({
    origin: frontendBaseUrl,
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    // カスタムヘッダーを追加する場合はここにも明示的に追記する。
    allowedHeaders: ["Content-Type", "Authorization"],
    maxAge: 86400,
  })
);

app.use(express.json());

// ルーティング
app.use("/api/quests", questsRouter);
app.use("/api/reviews", reviewsRouter);
app.use("/api/users", usersRouter);
app.use("/api/mypage", mypageRouter);
app.use("/api/admin/users", adminUsersRouter);
app.use(errorHandler);

// サーバー起動
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
