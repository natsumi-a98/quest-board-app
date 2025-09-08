import prisma from "../../lib/prisma";
import { Reward } from "@prisma/client";

export class RewardDataAccessor {
  // クエストIDで報酬一覧取得
  async findByQuestId(questId: number): Promise<Reward[]> {
    return await prisma.reward.findMany({
      where: { quest_id: questId },
    });
  }

  // 報酬作成
  async create(data: any): Promise<Reward> {
    return await prisma.reward.create({
      data,
    });
  }

  // 報酬更新
  async update(id: number, data: any): Promise<Reward> {
    return await prisma.reward.update({
      where: { id },
      data,
    });
  }

  // 報酬削除
  async delete(id: number): Promise<Reward> {
    return await prisma.reward.delete({
      where: { id },
    });
  }

  // IDで報酬取得
  async findById(id: number): Promise<Reward | null> {
    return await prisma.reward.findUnique({
      where: { id },
    });
  }
}
