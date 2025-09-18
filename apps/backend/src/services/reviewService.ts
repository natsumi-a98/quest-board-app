import {
  ReviewDataAccessor,
  CreateReviewData,
  UpdateReviewData,
} from "../dataAccessor/dbAccessor";

const reviewDataAccessor = new ReviewDataAccessor();

// クエストIDでレビュー一覧取得
export const getReviewsByQuestIdService = async (questId: number) => {
  const reviews = await reviewDataAccessor.findByQuestId(questId);
  return reviews;
};

// レビュー作成
export const createReviewService = async (data: CreateReviewData) => {
  try {
    // 既存のレビューをチェック（1アカウント1投稿の制限）
    const existingReview = await reviewDataAccessor.findByUserAndQuest(
      data.reviewer_id,
      data.questId
    );

    if (existingReview) {
      throw new Error("このクエストには既にレビューを投稿済みです。");
    }

    const review = await reviewDataAccessor.create(data);
    return review;
  } catch (error) {
    console.error("レビュー作成エラー:", error);
    throw error;
  }
};

// レビュー更新
export const updateReviewService = async (
  reviewId: number,
  data: UpdateReviewData
) => {
  const review = await reviewDataAccessor.update(reviewId, data);
  return review;
};

// レビュー削除
export const deleteReviewService = async (reviewId: number) => {
  await reviewDataAccessor.delete(reviewId);
};

// ユーザーが特定のクエストにレビューを投稿済みかチェック
export const checkUserReviewExistsService = async (
  userId: number,
  questId: number
) => {
  try {
    const review = await reviewDataAccessor.findByUserAndQuest(userId, questId);
    return !!review;
  } catch (error) {
    console.error("レビュー存在チェックエラー:", error);
    throw error;
  }
};
