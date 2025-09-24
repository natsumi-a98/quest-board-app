import * as dotenv from "dotenv";
import { join } from "node:path";
// .env.local を優先して読み込む（なければ何もしない）
dotenv.config({ path: join(process.cwd(), ".env.local") });
import { PrismaClient } from "@prisma/client";

// PrismaClient のシングルトンインスタンスを提供
// - 開発環境ではホットリロードによる多重生成を防ぐため globalThis に保持
// - 本番環境では通常のシングルトンとして運用
declare global {
  // eslint-disable-next-line no-var
  var prismaGlobal: PrismaClient | undefined;
}

const prisma = globalThis.prismaGlobal ?? new PrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalThis.prismaGlobal = prisma;
}

export default prisma;
