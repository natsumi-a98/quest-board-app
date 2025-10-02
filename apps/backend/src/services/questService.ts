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

// 全クエスト取得（削除済みも含む）- 管理者用
export const getAllQuestsIncludingDeletedService = async ({
  keyword,
  status,
}: GetAllQuestsParams) => {
  const quests = await questDataAccessor.findAllIncludingDeleted({
    keyword,
    status,
  });
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

// クエスト作成
export const createQuestService = async (questData: {
  title: string;
  description: string;
  type: string;
  status: string;
  maxParticipants: number;
  tags: string[];
  start_date: Date;
  end_date: Date;
  incentive_amount: number;
  point_amount: number;
  note: string;
}) => {
  const quest = await questDataAccessor.create({
    title: questData.title,
    description: questData.description,
    type: questData.type,
    status: questData.status,
    maxParticipants: questData.maxParticipants,
    tags: questData.tags,
    start_date: questData.start_date,
    end_date: questData.end_date,
    rewards: {
      create: {
        incentive_amount: questData.incentive_amount,
        point_amount: questData.point_amount,
        note: questData.note,
      },
    },
  });
  return quest;
};

// クエスト編集
export const updateQuestService = async (
  id: number,
  questData: {
    title: string;
    description: string;
    type: string;
    status: string;
    maxParticipants: number;
    tags: string[];
    start_date: Date;
    end_date: Date;
    incentive_amount: number;
    point_amount: number;
    note: string;
  }
) => {
  const quest = await questDataAccessor.update(id, {
    title: questData.title,
    description: questData.description,
    type: questData.type,
    status: questData.status,
    maxParticipants: questData.maxParticipants,
    tags: questData.tags,
    start_date: questData.start_date,
    end_date: questData.end_date,
    rewards: {
      update: {
        incentive_amount: questData.incentive_amount,
        point_amount: questData.point_amount,
        note: questData.note,
      },
    },
  });
  return quest;
};

// クエスト削除
export const deleteQuestService = async (id: number) => {
  const quest = await questDataAccessor.delete(id);
  return quest;
};

// クエスト復元
export const restoreQuestService = async (id: number) => {
  const quest = await questDataAccessor.restore(id);
  return quest;
};
