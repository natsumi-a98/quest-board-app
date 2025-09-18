import prisma from "../config/prisma";

interface CreateReviewData {
  questId: number;
  reviewer_id: number;
  rating: number;
  comment?: string;
}

// クエストIDでレビュー一覧取得
export const getReviewsByQuestIdService = async (questId: number) => {
  const reviews = await prisma.review.findMany({
    where: {
      // 現在のスキーマでは quest_id フィールドがないため、
      // 一旦すべてのレビューを返す（後でスキーマを修正する必要があります）
    },
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
  const review = await prisma.review.create({
    data: {
      reviewer_id: data.reviewer_id,
      guest_id: 1, // 仮の値（現在のスキーマでは必須）
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
