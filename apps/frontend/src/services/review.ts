import { apiClient } from "./httpClient";

export interface ReviewResponse {
  id: number;
  reviewer_id: number;
  guest_id: number;
  rating: number;
  comment: string | null;
  created_at: string;
  reviewer: {
    id: number;
    name: string;
  };
}

export interface CreateReviewRequest {
  reviewer_id: number;
  rating: number;
  comment?: string;
}

/**
 * レビュー関連のAPIサービス
 */
export const reviewService = {
  /**
   * クエストIDでレビュー一覧を取得
   */
  getReviewsByQuestId: async (questId: string): Promise<ReviewResponse[]> => {
    return apiClient.get<ReviewResponse[]>(`/reviews/quest/${questId}`);
  },

  /**
   * レビューを作成
   */
  createReview: async (
    questId: string,
    data: CreateReviewRequest
  ): Promise<ReviewResponse> => {
    return apiClient.post<ReviewResponse>(`/reviews/quest/${questId}`, data);
  },
};
