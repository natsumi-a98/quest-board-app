// backend/src/config/db.ts
import { PrismaClient } from "@prisma/client";

export const prisma = new PrismaClient();

// シャットダウン時に PrismaClient をクリーンに切断
process.on("beforeExit", async () => {
  await prisma.$disconnect();
});
