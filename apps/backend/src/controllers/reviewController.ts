import { Request, Response } from "express";
import {
  getReviewsByQuestIdService,
  createReviewService,
} from "../services/reviewService";

// クエストIDでレビュー一覧取得
export const getReviewsByQuestId = async (req: Request, res: Response) => {
  const questId = Number(req.params.questId);

  try {
    const reviews = await getReviewsByQuestIdService(questId);
    res.json(reviews);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch reviews" });
  }
};

// レビュー作成
export const createReview = async (req: Request, res: Response) => {
  const questId = Number(req.params.questId);
  const { reviewer_id, rating, comment } = req.body;

  if (!reviewer_id || !rating) {
    return res
      .status(400)
      .json({ message: "reviewer_id and rating are required" });
  }

  if (rating < 1 || rating > 5) {
    return res.status(400).json({ message: "rating must be between 1 and 5" });
  }

  try {
    const review = await createReviewService({
      questId,
      reviewer_id,
      rating,
      comment,
    });
    res.status(201).json(review);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to create review" });
  }
};
