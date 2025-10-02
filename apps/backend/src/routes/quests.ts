import express from "express";
import {
  getAllQuests,
  getAllQuestsIncludingDeleted,
  getQuestById,
  updateQuestStatus,
  createQuest,
  updateQuest,
  deleteQuest,
  reactivateQuest,
  submitQuestForApproval,
  restoreQuest,
} from "../controllers/questController";

const router = express.Router();

router.get("/", getAllQuests); // GET /quests
router.get("/admin/all", getAllQuestsIncludingDeleted); // GET /quests/admin/all (管理者用)
router.get("/:id", getQuestById); // GET /quests/:id
router.post("/", createQuest); // POST /quests
router.put("/:id", updateQuest); // PUT /quests/:id
router.patch("/:id/status", updateQuestStatus); // PATCH /quests/:id/status
router.patch("/:id/submit", submitQuestForApproval); // PATCH /quests/:id/submit (承認待ち申請)
router.patch("/:id/restore", restoreQuest); // PATCH /quests/:id/restore (復元)
router.patch("/:id/reactivate", reactivateQuest); // PATCH /quests/:id/reactivate
router.delete("/:id", deleteQuest); // DELETE /quests/:id (論理削除)

export default router;
