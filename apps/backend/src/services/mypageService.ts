import { prisma } from "../config/db";

// 参加中クエスト一覧を取得
export const getUserEntries = async (userId: number) => {
  const entries = await prisma.questParticipant.findMany({
    where: { user_id: userId, cleared_at: null },
    select: {
      quest: {
        select: {
          id: true,
          title: true,
          description: true,
          created_at: true,
        },
      },
    },
  });

  return entries.map((e) => e.quest);
};

// 達成済みクエスト一覧を取得
export const getUserClearedQuests = async (userId: number) => {
  const cleared = await prisma.questParticipant.findMany({
    where: { user_id: userId, cleared_at: { not: null } },
    select: {
      quest: {
        select: {
          id: true,
          title: true,
          description: true,
          // cleared_at: true,
        },
      },
    },
  });

  return cleared.map((c) => c.quest);
};
