import express from "express";
import {
  getReviewsByQuestId,
  createReview,
} from "../controllers/reviewController";

const router = express.Router();

router.get("/quest/:questId", getReviewsByQuestId); // GET /reviews/quest/:questId
router.post("/quest/:questId", createReview); // POST /reviews/quest/:questId

export default router;
