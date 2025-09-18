import prisma from "../../config/prisma";
import { User } from "@prisma/client";

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

  // ユーザー作成
  async create(data: any): Promise<User> {
    return await prisma.user.create({
      data,
    });
  }

  // ユーザー更新
  async update(id: number, data: any): Promise<User> {
    return await prisma.user.update({
      where: { id },
      data,
    });
  }

  // ユーザー削除
  async delete(id: number): Promise<User> {
    return await prisma.user.delete({
      where: { id },
    });
  }
}
