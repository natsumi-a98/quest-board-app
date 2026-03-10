import rateLimit from "express-rate-limit";

/**
 * 全 API エンドポイントに適用するデフォルトレートリミッター
 * - IP アドレス単位で制限
 * - 15 分間に最大 200 リクエスト
 */
export const apiRateLimiter = rateLimit({
	windowMs: 15 * 60 * 1000, // 15 分
	limit: 200,
	standardHeaders: "draft-7",
	legacyHeaders: false,
	message: {
		success: false,
		error: "Too many requests. Please try again later.",
		code: "TOO_MANY_REQUESTS",
	},
});

/**
 * クエスト検索エンドポイント（GET /api/quests）向けの厳格なレートリミッター
 * - IP アドレス単位で制限
 * - 1 分間に最大 60 リクエスト
 */
export const questSearchRateLimiter = rateLimit({
	windowMs: 60 * 1000, // 1 分
	limit: 60,
	standardHeaders: "draft-7",
	legacyHeaders: false,
	message: {
		success: false,
		error: "Too many search requests. Please slow down.",
		code: "TOO_MANY_REQUESTS",
	},
});
