import express from "express";
import cors from "cors";
import questsRouter from "./routes/quests";

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

// サーバー起動
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
