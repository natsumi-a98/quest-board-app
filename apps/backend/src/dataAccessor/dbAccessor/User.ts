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

  // 全ユーザー取得
  async findAll(): Promise<User[]> {
    return await prisma.user.findMany({
      orderBy: { id: "asc" },
    });
  }

  // ユーザー削除
  async delete(id: number): Promise<User> {
    return await prisma.user.delete({
      where: { id },
    });
  }
}
