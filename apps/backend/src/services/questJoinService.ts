import prisma from "../config/prisma";

export const addUserToQuest = async (userId: number, questId: number) => {
  try {
    // トランザクション開始
    await prisma.$transaction(async (tx) => {
      // ① クエスト行をロック
      const quest = await tx.$queryRaw<
        { id: number; maxParticipants: number | null }[]
      >`SELECT id, max_participants as maxParticipants FROM quests WHERE id = ${questId} FOR UPDATE`;

      if (quest.length === 0) {
        throw new Error("Quest not found");
      }

      const maxParticipants = quest[0].maxParticipants;

      // ② 重複参加チェック（ユニーク制約でも防げるが明示的にチェック）
      const existing = await tx.questParticipant.findUnique({
        where: { user_id_quest_id: { user_id: userId, quest_id: questId } },
      });
      if (existing) {
        throw new Error("Already joined");
      }

      // ③ 現在の参加人数を取得
      const count = await tx.questParticipant.count({
        where: { quest_id: questId },
      });

      if (maxParticipants !== null && count >= maxParticipants) {
        throw new Error("Quest is full");
      }

      // ④ 参加登録
      await tx.questParticipant.create({
        data: {
          user_id: userId,
          quest_id: questId,
        },
      });
    });

    // 正常終了
    return { success: true };
  } catch (err: any) {
    // エラーハンドリング（呼び出し側で理由別に処理できるようにする）
    if (err.message === "Already joined") {
      return { success: false, reason: "duplicate" };
    }
    if (err.message === "Quest is full") {
      return { success: false, reason: "full" };
    }
    if (err.message === "Quest not found") {
      return { success: false, reason: "not_found" };
    }

    console.error(err);
    return { success: false, reason: "error" };
  }
};
