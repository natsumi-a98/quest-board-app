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
    return apiClient.patch<Quest, { status: string }>(`/quests/${id}/status`, {
      status,
    });
  },

  /**
   * クエストを作成
   */
  createQuest: async (questData: {
    title: string;
    description: string;
    type: string;
    status?: string;
    maxParticipants: number;
    tags: string[];
    start_date: string;
    end_date: string;
    incentive_amount?: number;
    point_amount?: number;
    note?: string;
  }): Promise<Quest> => {
    return apiClient.post<Quest, typeof questData>("/quests", questData);
  },

  /**
   * クエストを編集
   */
  updateQuest: async (
    id: string,
    questData: {
      title: string;
      description: string;
      type: string;
      status?: string;
      maxParticipants: number;
      tags: string[];
      start_date: string;
      end_date: string;
      incentive_amount?: number;
      point_amount?: number;
      note?: string;
    }
  ): Promise<Quest> => {
    return apiClient.put<Quest, typeof questData>(`/quests/${id}`, questData);
  },

  /**
   * クエストを削除
   */
  deleteQuest: async (id: string): Promise<{ message: string }> => {
    return apiClient.delete<{ message: string }>(`/quests/${id}`);
  },

  /**
   * クエストを再公開（停止中からアクティブに変更）
   */
  reactivateQuest: async (
    id: string
  ): Promise<{ message: string; quest: Quest }> => {
    return apiClient.patch<{ message: string; quest: Quest }, {}>(
      `/quests/${id}/reactivate`,
      {}
    );
  },
};
