import { mockQuests } from "../data/mockQuests";

interface QuestFilterOptions {
  keyword?: string;
  status?: string;
}

// 全クエスト取得サービス（フィルタ機能付き）
export const getAllQuestsService = (filters: QuestFilterOptions) => {
  const { keyword, status } = filters;

  let filteredQuests = mockQuests;

  if (keyword) {
    const lowerKeyword = keyword.toLowerCase();
    filteredQuests = filteredQuests.filter(
      (quest) =>
        quest.title.toLowerCase().includes(lowerKeyword) ||
        quest.description.toLowerCase().includes(lowerKeyword)
    );
  }

  if (status) {
    filteredQuests = filteredQuests.filter((quest) => quest.status === status);
  }

  return filteredQuests;
};

// IDから1件のクエスト取得サービス
export const getQuestByIdService = (id: number) => {
  return mockQuests.find((quest) => quest.id === id);
};
