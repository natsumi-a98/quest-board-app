import prisma from "../lib/prisma";

interface CreateReviewData {
  questId: number;
  reviewer_id: number;
  rating: number;
  comment?: string;
}

interface UpdateReviewData {
  rating: number;
  comment?: string;
}

// クエストIDでレビュー一覧取得
export const getReviewsByQuestIdService = async (questId: number) => {
  const reviews = await prisma.review.findMany({
    where: {
      quest_id: questId,
    } as any,
    include: {
      reviewer: {
        select: {
          id: true,
          name: true,
        },
      },
    },
    orderBy: {
      created_at: "desc",
    },
  });

  return reviews;
};

// レビュー作成
export const createReviewService = async (data: CreateReviewData) => {
  try {
    // 既存のレビューをチェック（1アカウント1投稿の制限）
    const existingReview = await prisma.review.findFirst({
      where: {
        reviewer_id: data.reviewer_id,
        quest_id: data.questId,
      } as any,
    });

    if (existingReview) {
      throw new Error("このクエストには既にレビューを投稿済みです。");
    }

    const review = await prisma.review.create({
      data: {
        reviewer_id: data.reviewer_id,
        quest_id: data.questId,
        guest_id: 1, // 仮の値（現在のスキーマでは必須）
        rating: data.rating,
        comment: data.comment,
      } as any,
      include: {
        reviewer: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

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
  const review = await prisma.review.update({
    where: {
      id: reviewId,
    },
    data: {
      rating: data.rating,
      comment: data.comment,
    },
    include: {
      reviewer: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  });

  return review;
};

// レビュー削除
export const deleteReviewService = async (reviewId: number) => {
  await prisma.review.delete({
    where: {
      id: reviewId,
    },
  });
};

// ユーザーが特定のクエストにレビューを投稿済みかチェック
export const checkUserReviewExistsService = async (
  userId: number,
  questId: number
) => {
  try {
    const review = await prisma.review.findFirst({
      where: {
        reviewer_id: userId,
        quest_id: questId,
      } as any,
    });

    return !!review;
  } catch (error) {
    console.error("レビュー存在チェックエラー:", error);
    throw error;
  }
};
