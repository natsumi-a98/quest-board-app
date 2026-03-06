import { prisma } from "../../config/db";

export class MypageDataAccessor {
  // 参加中クエスト
  async fetchUserParticipatingQuests(userId: number) {
    return prisma.questParticipant.findMany({
      where: {
        user_id: userId,
        cleared_at: null,
      },
      include: { quest: true },
    });
  }

  // 達成済みクエスト
  async fetchUserClearedQuests(userId: number) {
    return prisma.questParticipant.findMany({
      where: {
        user_id: userId,
        cleared_at: { not: null },
      },
      include: { quest: true },
    });
  }

  // 応募中クエスト
  async fetchUserAppliedQuests(userId: number) {
    return prisma.entry.findMany({
      where: {
        user_id: userId,
        status: "pending",
      },
      include: { quest: true },
    });
  }

  // ユーザー情報
  async fetchUserById(userId: number) {
    return prisma.user.findUnique({
      where: { id: userId },
    });
  }

  // 通知一覧
  async fetchUserNotifications(userId: number) {
    return prisma.notification.findMany({
      where: { user_id: userId },
      orderBy: { created_at: "desc" },
    });
  }
}
