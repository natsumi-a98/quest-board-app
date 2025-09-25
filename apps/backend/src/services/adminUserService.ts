import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const getAllUsersForAdminService = async () => {
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
};
