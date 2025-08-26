import express from "express";
import {
  getAllQuests,
  getQuestById,
  updateQuestStatus,
} from "../controllers/questController";

const router = express.Router();

router.get("/", getAllQuests); // GET /quests
router.get("/:id", getQuestById); // GET /quests/:id
router.patch("/:id/status", updateQuestStatus); // PATCH /quests/:id/status

export default router;
