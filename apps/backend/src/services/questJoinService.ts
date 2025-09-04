import prisma from "../config/db";

export const addUserToQuest = async (userId: number, questId: number) => {
  try {
    // すでに参加済みかチェック
    const existing = await prisma.questParticipant.findUnique({
      where: { user_id_quest_id: { user_id: userId, quest_id: questId } },
    });

    if (existing) return false; // すでに参加済み

    // 参加情報を作成
    await prisma.questParticipant.create({
      data: {
        user_id: userId,
        quest_id: questId,
      },
    });

    return true;
  } catch (err) {
    console.error(err);
    return false;
  }
};
