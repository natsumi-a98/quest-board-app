import { MypageDataAccessor } from "../dataAccessor/dbAccessor";

export class MypageService {
  constructor(private readonly mypageDataAccessor = new MypageDataAccessor()) {}

  async getUserEntries(userId: number) {
    const participating =
      await this.mypageDataAccessor.fetchUserParticipatingQuests(userId);
    const cleared = await this.mypageDataAccessor.fetchUserClearedQuests(userId);
    const applied = await this.mypageDataAccessor.fetchUserAppliedQuests(userId);

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
  }

  async getUserProfile(userId: number) {
    const user = await this.mypageDataAccessor.fetchUserById(userId);
    if (!user) return null;

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    };
  }

  async getUserNotifications(userId: number) {
    const notifications =
      await this.mypageDataAccessor.fetchUserNotifications(userId);

    return notifications.map((notification) => ({
      id: notification.id,
      message: notification.message,
      isRead: notification.is_read,
      createdAt: notification.created_at,
    }));
  }
}

export const mypageService = new MypageService();
