import prisma from "../../config/prisma";
import { QuestParticipant } from "@prisma/client";

export class QuestParticipantDataAccessor {
  // クエストIDで参加者一覧取得
  async findByQuestId(questId: number): Promise<QuestParticipant[]> {
    return await prisma.questParticipant.findMany({
      where: { quest_id: questId },
      include: {
        user: true,
      },
    });
  }

  // ユーザーIDで参加クエスト一覧取得
  async findByUserId(userId: number): Promise<QuestParticipant[]> {
    return await prisma.questParticipant.findMany({
      where: { user_id: userId },
      include: {
        quest: true,
      },
    });
  }

  // 参加者追加
  async create(data: any): Promise<QuestParticipant> {
    return await prisma.questParticipant.create({
      data,
    });
  }

  // 参加者削除
  async delete(id: number): Promise<QuestParticipant> {
    return await prisma.questParticipant.delete({
      where: { id },
    });
  }

  // 特定のクエストとユーザーの組み合わせで参加者取得
  async findByQuestAndUser(
    questId: number,
    userId: number
  ): Promise<QuestParticipant | null> {
    return await prisma.questParticipant.findFirst({
      where: {
        quest_id: questId,
        user_id: userId,
      },
    });
  }
}
