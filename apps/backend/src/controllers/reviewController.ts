import { Request, Response } from "express";
import {
  getReviewsByQuestIdService,
  createReviewService,
  updateReviewService,
  deleteReviewService,
  checkUserReviewExistsService,
} from "../services/reviewService";
import { asyncHandler } from "../utils/asyncHandler";
import { badRequest } from "../utils/appError";

/**
 * クエストに紐づくレビュー一覧を返す。
 */
export const getReviewsByQuestId = asyncHandler(
  async (req: Request, res: Response) => {
    const questId = Number(req.params.questId);
    const reviews = await getReviewsByQuestIdService(questId);
    res.json(reviews);
  }
);

/**
 * クエストへのレビューを新規作成する。
 */
export const createReview = asyncHandler(async (req: Request, res: Response) => {
  const questId = Number(req.params.questId);
  const { reviewer_id, rating, comment } = req.body;

  if (!reviewer_id || !rating) {
    throw badRequest("reviewer_id and rating are required");
  }

  if (rating < 1 || rating > 5) {
    throw badRequest("rating must be between 1 and 5");
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
    if (
      error instanceof Error &&
      error.message.includes("既にレビューを投稿済み")
    ) {
      throw badRequest(error.message);
    }

    throw error;
  }
});

/**
 * 既存レビューを更新する。
 */
export const updateReview = asyncHandler(async (req: Request, res: Response) => {
  const reviewId = Number(req.params.reviewId);
  const { rating, comment } = req.body;

  if (!rating) {
    throw badRequest("rating is required");
  }

  if (rating < 1 || rating > 5) {
    throw badRequest("rating must be between 1 and 5");
  }

  const review = await updateReviewService(reviewId, {
    rating,
    comment,
  });
  res.json(review);
});

/**
 * レビューを削除する。
 */
export const deleteReview = asyncHandler(async (req: Request, res: Response) => {
  const reviewId = Number(req.params.reviewId);
  await deleteReviewService(reviewId);
  res.status(204).send();
});

/**
 * 指定ユーザーが対象クエストにレビュー済みかを返す。
 */
export const checkUserReviewExists = asyncHandler(
  async (req: Request, res: Response) => {
    const { userId, questId } = req.params;
    const exists = await checkUserReviewExistsService(
      Number(userId),
      Number(questId)
    );

    res.json({ exists });
  }
);
