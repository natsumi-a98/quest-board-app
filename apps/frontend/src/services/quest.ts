import { apiClient } from "./httpClient";
import { Quest } from "../types/quest";

/**
 * クエスト関連のAPIサービス
 */
export const questService = {
  /**
   * IDでクエストを取得
   */
  getQuestById: async (id: string): Promise<Quest> => {
    return apiClient.get<Quest>(`/quests/${id}`);
  },

  /**
   * 全クエストを取得
   */
  getAllQuests: async (params?: {
    keyword?: string;
    status?: string;
  }): Promise<Quest[]> => {
    return apiClient.get<Quest[]>("/quests", params);
  },

  /**
   * クエストのステータスを更新
   */
  updateQuestStatus: async (id: string, status: string): Promise<Quest> => {
    return apiClient.patch<Quest>(`/quests/${id}/status`, { status });
  },
};
