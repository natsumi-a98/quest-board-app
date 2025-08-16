import { Router } from "express";
import { getMyEntries, getMyClearedQuests } from "../controllers/mypageController";
import { authMiddleware } from "../middlewares/auth.middleware";

const router = Router();

// 自分の参加中クエスト一覧
router.get("/mypage/entries", authMiddleware, getMyEntries);

// 自分の達成済みクエスト一覧
router.get("/mypage/cleared", authMiddleware, getMyClearedQuests);

export default router;
