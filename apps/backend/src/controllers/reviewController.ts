import { Request, Response } from "express";
import {
  getReviewsByQuestIdService,
  createReviewService,
  updateReviewService,
  deleteReviewService,
  checkUserReviewExistsService,
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
    console.error("レビュー作成エラー:", error);

    // エラーメッセージに基づいて適切なHTTPステータスを返す
    if (
      error instanceof Error &&
      error.message.includes("既にレビューを投稿済み")
    ) {
      res.status(400).json({ message: error.message });
    } else {
      // より詳細なエラーメッセージを返す（開発環境用）
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      const errorStack = error instanceof Error ? error.stack : undefined;
      console.error("詳細エラー:", errorMessage, errorStack);
      res.status(500).json({
        message: "Failed to create review",
        error: errorMessage,
      });
    }
  }
};

// レビュー更新
export const updateReview = async (req: Request, res: Response) => {
  const reviewId = Number(req.params.reviewId);
  const { rating, comment } = req.body;

  if (!rating) {
    return res.status(400).json({ message: "rating is required" });
  }

  if (rating < 1 || rating > 5) {
    return res.status(400).json({ message: "rating must be between 1 and 5" });
  }

  try {
    const review = await updateReviewService(reviewId, {
      rating,
      comment,
    });
    res.json(review);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to update review" });
  }
};

// レビュー削除
export const deleteReview = async (req: Request, res: Response) => {
  const reviewId = Number(req.params.reviewId);

  try {
    await deleteReviewService(reviewId);
    res.status(204).send();
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to delete review" });
  }
};

// ユーザーが特定のクエストにレビューを投稿済みかチェック
export const checkUserReviewExists = async (req: Request, res: Response) => {
  const { userId, questId } = req.params;

  try {
    const exists = await checkUserReviewExistsService(
      Number(userId),
      Number(questId)
    );

    res.json({ exists });
  } catch (error) {
    console.error("レビュー存在チェックエラー:", error);
    res.status(500).json({ message: "Failed to check review existence" });
  }
};
