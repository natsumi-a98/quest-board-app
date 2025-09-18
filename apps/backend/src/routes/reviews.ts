import express from "express";
import {
  getReviewsByQuestId,
  createReview,
  updateReview,
  deleteReview,
  checkUserReviewExists,
} from "../controllers/reviewController";

const router = express.Router();

router.get("/quest/:questId", getReviewsByQuestId); // GET /reviews/quest/:questId
router.post("/quest/:questId", createReview); // POST /reviews/quest/:questId
router.put("/:reviewId", updateReview); // PUT /reviews/:reviewId
router.delete("/:reviewId", deleteReview); // DELETE /reviews/:reviewId
router.get("/check/:userId/:questId", checkUserReviewExists); // GET /reviews/check/:userId/:questId

export default router;
