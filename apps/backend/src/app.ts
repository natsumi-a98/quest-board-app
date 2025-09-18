import express from "express";
import cors from "cors";
import questsRouter from "./routes/quests";
import reviewsRouter from "./routes/reviews";
import mypageRouter from "./routes/mypage";

const app = express();
const PORT = process.env.PORT || 3001;

// CORS 設定
app.use(
  cors({
    origin: "http://localhost:3000", // フロントエンドのURLを指定
    credentials: true,               // CookieやAuthorizationヘッダーを許可
  })
);

app.use(express.json());

// ルーティング
app.use("/api/quests", questsRouter);
app.use("/api/reviews", reviewsRouter);
app.use("/api/mypage", mypageRouter);

// サーバー起動
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});