// src/services/mypageService.ts
import {
  fetchUserParticipatingQuests,
  fetchUserClearedQuests,
  fetchUserAppliedQuests,
  fetchUserById,
  fetchUserNotifications,
} from "../dataAccessor/dbAccessor/mypageDb";

export const getUserEntries = async (userId: number) => {
  const participating = await fetchUserParticipatingQuests(userId);
  const cleared = await fetchUserClearedQuests(userId);
  const applied = await fetchUserAppliedQuests(userId);

  return {
    participating: participating.map((p) => ({
      id: p.quest.id,
      title: p.quest.title,
      status: "participating",
      joinedAt: p.joined_at,
    })),
    completed: cleared.map((c) => ({
      id: c.quest.id,
      title: c.quest.title,
      status: "cleared",
      clearedAt: c.cleared_at,
    })),
    applied: applied.map((a) => ({
      id: a.quest.id,
      title: a.quest.title,
      status: "applied",
      appliedAt: a.applied_at,
    })),
  };
};

export const getUserProfile = async (userId: number) => {
  const user = await fetchUserById(userId);
  if (!user) return null;
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
  };
};

export const getUserNotifications = async (userId: number) => {
  const notifs = await fetchUserNotifications(userId);
  return notifs.map((n) => ({
    id: n.id,
    message: n.message,
    isRead: n.is_read,
    createdAt: n.created_at,
  }));
};
