import { existsSync } from "node:fs";
import { dirname, resolve } from "node:path";
import * as dotenv from "dotenv";

const backendRoot = resolve(dirname(__dirname), "..");

const envCandidates = [
	resolve(process.cwd(), ".env.local"),
	resolve(process.cwd(), "apps/backend/.env.local"),
	resolve(backendRoot, ".env.local"),
];

for (const path of [...new Set(envCandidates)]) {
	if (!existsSync(path)) {
		continue;
	}

	dotenv.config({ path });
	break;
}

dotenv.config();

if (!process.env.DATABASE_URL) {
	throw new Error(
		"DATABASE_URL が未設定です。apps/backend/.env.local を確認してください。",
	);
}
