import express from "express";
import {
  getAllQuests,
  getQuestById,
  updateQuestStatus,
  createQuest,
  updateQuest,
  deleteQuest,
  reactivateQuest,
} from "../controllers/questController";

const router = express.Router();

router.get("/", getAllQuests); // GET /quests
router.get("/:id", getQuestById); // GET /quests/:id
router.post("/", createQuest); // POST /quests
router.put("/:id", updateQuest); // PUT /quests/:id
router.patch("/:id/status", updateQuestStatus); // PATCH /quests/:id/status
router.patch("/:id/reactivate", reactivateQuest); // PATCH /quests/:id/reactivate
router.delete("/:id", deleteQuest); // DELETE /quests/:id

export default router;
