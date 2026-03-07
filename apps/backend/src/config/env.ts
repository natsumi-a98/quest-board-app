import * as dotenv from "dotenv";
import { join } from "node:path";

dotenv.config({ path: join(process.cwd(), ".env.local") });
dotenv.config();

if (!process.env.DATABASE_URL) {
  process.env.DATABASE_URL =
    "mysql://app_user:app_password@localhost:3306/your_project_db";
}
