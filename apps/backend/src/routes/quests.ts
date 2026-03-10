import express from "express";
import {
	createQuest,
	deleteQuest,
	getAllQuests,
	getAllQuestsIncludingDeleted,
	getQuestById,
	reactivateQuest,
	restoreQuest,
	submitQuestForApproval,
	updateQuest,
	updateQuestStatus,
} from "../controllers/questController";
import { joinQuest } from "../controllers/questJoinController";
import { authMiddleware, requireAdmin } from "../middlewares/auth.middleware";
import { questSearchRateLimiter } from "../middlewares/rateLimiter";

const router = express.Router();

router.get("/", questSearchRateLimiter, getAllQuests); // GET /quests
router.get(
	"/admin/all",
	authMiddleware,
	requireAdmin,
	getAllQuestsIncludingDeleted,
); // GET /quests/admin/all (管理者用)
router.get("/:id", getQuestById); // GET /quests/:id
router.post("/", authMiddleware, createQuest); // POST /quests
router.put("/:id", authMiddleware, requireAdmin, updateQuest); // PUT /quests/:id
router.patch("/:id/status", authMiddleware, requireAdmin, updateQuestStatus); // PATCH /quests/:id/status
router.patch("/:id/submit", authMiddleware, submitQuestForApproval); // PATCH /quests/:id/submit (承認待ち申請)
router.patch("/:id/restore", authMiddleware, requireAdmin, restoreQuest); // PATCH /quests/:id/restore (復元)
router.patch("/:id/reactivate", authMiddleware, requireAdmin, reactivateQuest); // PATCH /quests/:id/reactivate
router.delete("/:id", authMiddleware, requireAdmin, deleteQuest); // DELETE /quests/:id (論理削除)
// クエスト参加
router.post("/:questId/join", authMiddleware, joinQuest); // POST /quests/:questId/join

export default router;
