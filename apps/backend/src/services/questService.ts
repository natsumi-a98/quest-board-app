import { mockQuests } from "../data/mockQuests";

// 全クエスト取得サービス
export const getAllQuestsService = () => {
  return mockQuests;
};

// IDから1件のクエスト取得サービス
export const getQuestByIdService = (id: number) => {
  return mockQuests.find((quest) => quest.id === id);
};
