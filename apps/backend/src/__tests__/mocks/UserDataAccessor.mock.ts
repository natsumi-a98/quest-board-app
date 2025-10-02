import { User } from "@prisma/client";

// 単体のユーザー
export const mockAdminUser1: User = {
  id: 1,
  name: "Alice",
  email: "alice@example.com",
  role: "admin",
  created_at: new Date("2025-01-01T00:00:00.000Z"),
  updated_at: new Date("2025-01-01T00:00:00.000Z"),
};

export const mockAdminUser2: User = {
  id: 2,
  name: "Bob",
  email: "bob@example.com",
  role: "user",
  created_at: new Date("2025-01-02T00:00:00.000Z"),
  updated_at: new Date("2025-01-02T00:00:00.000Z"),
};

// 管理者用に返すリスト
export const mockAllUsersForAdmin: Pick<User, "id" | "name" | "email" | "role" | "created_at" | "updated_at">[] = [
  mockAdminUser1,
  mockAdminUser2,
];

// **ここを忘れず export**
export const mockUserDataAccessor = {
  getAllForAdmin: jest.fn().mockResolvedValue(mockAllUsersForAdmin),
  findById: jest.fn(),
  findByEmail: jest.fn(),
  findByName: jest.fn(),
  findByNameOrEmail: jest.fn(),
  create: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
};
