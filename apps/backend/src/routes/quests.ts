import express from "express";
import { getAllQuests, getQuestById } from "../controllers/questController";

const router = express.Router();

router.get("/", getAllQuests); // GET /quests
router.get("/:id", getQuestById); // GET /quests/:id

export default router;
