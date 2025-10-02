import prisma from "../../config/prisma";
import { User } from "@prisma/client";

/**
 * ユーザー作成用のデータインターフェース
 */
export interface CreateUserData {
  name: string;
  email: string;
  role: string;
  firebase_uid: string;
}

/**
 * ユーザー更新用のデータインターフェース
 */
export interface UpdateUserData {
  name?: string;
  email?: string;
  role?: string;
  firebase_uid?: string;
}

export class UserDataAccessor {
  // IDでユーザー取得
  async findById(id: number): Promise<User | null> {
    return await prisma.user.findUnique({
      where: { id },
    });
  }

  // メールアドレスでユーザー取得
  async findByEmail(email: string): Promise<User | null> {
    return await prisma.user.findUnique({
      where: { email },
    });
  }

  // 名前でユーザー取得
  async findByName(name: string): Promise<User | null> {
    return await prisma.user.findFirst({
      where: { name },
    });
  }

  // 名前またはメールアドレスでユーザー取得
  async findByNameOrEmail(name: string, email: string): Promise<User | null> {
    return await prisma.user.findFirst({
      where: {
        OR: [{ name }, { email }],
      },
    });
  }

  // ユーザー作成
  async create(data: CreateUserData): Promise<User> {
    return await prisma.user.create({
      data,
    });
  }

  // ユーザー更新
  async update(id: number, data: UpdateUserData): Promise<User> {
    return await prisma.user.update({
      where: { id },
      data,
    });
  }

  // Firebase UIDでユーザー取得
  async findByFirebaseUid(firebaseUid: string): Promise<User | null> {
    return await prisma.user.findUnique({
      where: { firebase_uid: firebaseUid } as any,
    });
  }

    // 全ユーザー取得（管理者用）
async getAllForAdmin() {
  return await prisma.user.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      created_at: true,
    },
    orderBy: {
      created_at: "desc",
    },
  });
}

  // ユーザー削除
  async delete(id: number): Promise<User> {
    return await prisma.user.delete({
      where: { id },
    });
  }

  // Firebase UIDでユーザー削除
  async deleteByFirebaseUid(firebaseUid: string): Promise<User> {
    return await prisma.user.delete({
      where: { firebase_uid: firebaseUid } as any,
    });
  }

  // ユーザーの関連データを確認
  async findRelatedData(userId: number) {
    const [
      clearSubmissions,
      entries,
      feedbacks,
      incentivePayments,
      notifications,
      offers,
      pointTransactions,
      questParticipants,
      reviews,
    ] = await Promise.all([
      prisma.clearSubmission.count({ where: { user_id: userId } }),
      prisma.entry.count({ where: { user_id: userId } }),
      prisma.feedback.count({ where: { user_id: userId } }),
      prisma.incentivePayment.count({ where: { user_id: userId } }),
      prisma.notification.count({ where: { user_id: userId } }),
      prisma.offer.count({ where: { user_id: userId } }),
      prisma.pointTransaction.count({ where: { user_id: userId } }),
      prisma.questParticipant.count({ where: { user_id: userId } }),
      prisma.review.count({ where: { reviewer_id: userId } }),
    ]);

    return {
      clearSubmissions,
      entries,
      feedbacks,
      incentivePayments,
      notifications,
      offers,
      pointTransactions,
      questParticipants,
      reviews,
    };
  }

  // ユーザーの関連データを削除（外部キー制約の順序で削除）
  async deleteRelatedData(userId: number) {
    // 外部キー制約の順序で削除（子テーブルから親テーブルへ）
    await prisma.clearSubmission.deleteMany({ where: { user_id: userId } });
    await prisma.entry.deleteMany({ where: { user_id: userId } });
    await prisma.feedback.deleteMany({ where: { user_id: userId } });
    await prisma.incentivePayment.deleteMany({ where: { user_id: userId } });
    await prisma.notification.deleteMany({ where: { user_id: userId } });
    await prisma.offer.deleteMany({ where: { user_id: userId } });
    await prisma.pointTransaction.deleteMany({ where: { user_id: userId } });
    await prisma.questParticipant.deleteMany({ where: { user_id: userId } });
    await prisma.review.deleteMany({ where: { reviewer_id: userId } });
  }
}
