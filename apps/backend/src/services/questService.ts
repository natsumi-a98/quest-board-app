import { QuestDataAccessor } from "../dataAccessor/dbAccessor";

interface GetAllQuestsParams {
  keyword?: string;
  status?: string;
}

const questDataAccessor = new QuestDataAccessor();

// 全クエスト取得（オプションでキーワード・ステータスで絞り込み）
export const getAllQuestsService = async ({
  keyword,
  status,
}: GetAllQuestsParams) => {
  const quests = await questDataAccessor.findAll({ keyword, status });
  return quests;
};

// IDでクエスト取得
export const getQuestByIdService = async (id: number) => {
  const quest = await questDataAccessor.findById(id);
  return quest;
};

// ステータス更新
export const updateQuestStatusService = async (id: number, status: string) => {
  const quest = await questDataAccessor.updateStatus(id, status);
  return quest;
};
