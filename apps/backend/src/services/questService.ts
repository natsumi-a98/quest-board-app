import prisma from "../lib/prisma";

interface GetAllQuestsParams {
  keyword?: string;
  status?: string;
}

// 全クエスト取得（オプションでキーワード・ステータスで絞り込み）
export const getAllQuestsService = async ({
  keyword,
  status,
}: GetAllQuestsParams) => {
  const where: any = {};

  if (keyword) {
    where.OR = [
      { title: { contains: keyword } },
      { description: { contains: keyword } },
    ];
  }

  if (status) {
    where.status = status;
  }

  const quests = await prisma.quest.findMany({
    where,
    include: {
      rewards: true,
      quest_participants: { include: { user: true } },
      _count: { select: { quest_participants: true } },
    },
    orderBy: {
      start_date: "desc",
    },
  });

  return quests;
};

// IDでクエスト取得
export const getQuestByIdService = async (id: number) => {
  const quest = await prisma.quest.findUnique({
    where: { id },
    include: {
      rewards: true,
      quest_participants: {
        include: {
          user: true,
        },
      },
    },
  });

  return quest;
};

// ステータス更新
export const updateQuestStatusService = async (id: number, status: string) => {
  const quest = await prisma.quest.update({
    where: { id },
    data: { status },
    include: {
      rewards: true,
      quest_participants: { include: { user: true } },
      _count: { select: { quest_participants: true } },
    },
  });

  return quest;
};
