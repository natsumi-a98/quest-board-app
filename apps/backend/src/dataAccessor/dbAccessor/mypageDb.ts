// dbAccesor/mypageDb.ts
import { prisma } from "../../config/db";

// 参加中クエスト
export const fetchUserParticipatingQuests = async (userId: number) => {
  return prisma.questParticipant.findMany({
    where: {
      user_id: userId,
      cleared_at: null, // 未クリア
    },
    include: { quest: true },
  });
};

// 達成済みクエスト
export const fetchUserClearedQuests = async (userId: number) => {
  return prisma.questParticipant.findMany({
    where: {
      user_id: userId,
      cleared_at: { not: null }, // クリア済み
    },
    include: { quest: true },
  });
};

// 応募中クエスト
export const fetchUserAppliedQuests = async (userId: number) => {
  return prisma.entry.findMany({
    where: {
      user_id: userId,
      status: "pending", // ステータスは運用に合わせる
    },
    include: { quest: true },
  });
};

// ユーザー情報
export const fetchUserById = async (userId: number) => {
  return prisma.user.findUnique({
    where: { id: userId },
  });
};

// 通知一覧
export const fetchUserNotifications = async (userId: number) => {
  return prisma.notification.findMany({
    where: { user_id: userId },
    orderBy: { created_at: "desc" },
  });
};
