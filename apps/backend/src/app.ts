import express from "express";
import cors from "cors";
import questsRouter from "./routes/quests";
import reviewsRouter from "./routes/reviews";
import usersRouter from "./routes/users";
import mypageRouter from "./routes/mypage";
import usersRouter from "./routes/users";

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.use("/api/quests", questsRouter);
app.use("/api/reviews", reviewsRouter);
app.use("/api/users", usersRouter);
app.use("/api/mypage", mypageRouter);
app.use("/api/users", usersRouter);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
