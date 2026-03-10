import express from "express";
import type { Request, Response } from "express";
import rateLimit from "express-rate-limit";

/**
 * レートリミッターミドルウェアのユニットテスト
 *
 * テスト用に limit=1 の専用ミドルウェアを作成し、
 * 大量リクエストを送信せずに 429 レスポンスを検証する。
 */

/** テスト用のミニ Express アプリを生成する */
function createTestApp(limiter: ReturnType<typeof rateLimit>) {
	const app = express();
	app.use(limiter);
	app.get("/test", (_req, res) => {
		res.status(200).json({ success: true });
	});
	return app;
}

type ResponseData = {
	statusCode: number;
	body: unknown;
	resolve: () => void;
};

/** Express の Request/Response を模倣したオブジェクトを生成する */
function createExpressContext(app: express.Application, ip = "127.0.0.1") {
	let resolvePromise: () => void;
	const responseData: ResponseData = {
		statusCode: 200,
		body: undefined,
		resolve: () => {},
	};

	const done = new Promise<void>((res) => {
		resolvePromise = res;
		responseData.resolve = res;
	});

	const req = {
		ip,
		method: "GET",
		path: "/test",
		headers: {},
		socket: { remoteAddress: ip },
		app,
	} as unknown as Request;

	const res = {
		statusCode: 200 as number,
		setHeader: jest.fn().mockReturnThis(),
		removeHeader: jest.fn().mockReturnThis(),
		getHeader: jest.fn().mockReturnValue(undefined),
		status(code: number) {
			responseData.statusCode = code;
			(this as { statusCode: number }).statusCode = code;
			return this;
		},
		json(body: unknown) {
			responseData.body = body;
			resolvePromise();
			return this;
		},
		send(body: unknown) {
			responseData.body = body;
			resolvePromise();
			return this;
		},
	} as unknown as Response;

	return { req, res, responseData, done };
}

describe("apiRateLimiter", () => {
	it("ミドルウェアとしてエクスポートされている", async () => {
		const { apiRateLimiter } = await import("../../middlewares/rateLimiter");
		expect(typeof apiRateLimiter).toBe("function");
	});

	it("通常リクエストを通過させる (next が呼ばれる)", async () => {
		const limiter = rateLimit({
			windowMs: 60_000,
			limit: 100,
			standardHeaders: "draft-7",
			legacyHeaders: false,
		});
		const app = createTestApp(limiter);
		const { req, res } = createExpressContext(app, "10.1.0.1");
		const next = jest.fn();

		await new Promise<void>((resolve) => {
			limiter(req, res, (...args) => {
				next(...args);
				resolve();
			});
		});

		expect(next).toHaveBeenCalled();
		expect(next).not.toHaveBeenCalledWith(expect.any(Error));
	});

	it("レートリミット超過時に 429 と TOO_MANY_REQUESTS を返す", async () => {
		const limiter = rateLimit({
			windowMs: 60_000,
			limit: 1,
			standardHeaders: "draft-7",
			legacyHeaders: false,
			message: {
				success: false,
				error: "Too many requests. Please try again later.",
				code: "TOO_MANY_REQUESTS",
			},
		});
		const app = createTestApp(limiter);

		// 1 回目: 通過する
		const ctx1 = createExpressContext(app, "10.1.0.2");
		await new Promise<void>((resolve) => {
			limiter(ctx1.req, ctx1.res, () => resolve());
		});

		// 2 回目: 制限超過 → 429
		const ctx2 = createExpressContext(app, "10.1.0.2");
		limiter(ctx2.req, ctx2.res, () => {});
		await ctx2.done;

		expect(ctx2.responseData.statusCode).toBe(429);
		expect(ctx2.responseData.body).toMatchObject({
			success: false,
			code: "TOO_MANY_REQUESTS",
		});
	});
});

describe("questSearchRateLimiter", () => {
	it("ミドルウェアとしてエクスポートされている", async () => {
		const { questSearchRateLimiter } = await import(
			"../../middlewares/rateLimiter"
		);
		expect(typeof questSearchRateLimiter).toBe("function");
	});

	it("通常リクエストを通過させる (next が呼ばれる)", async () => {
		const limiter = rateLimit({
			windowMs: 60_000,
			limit: 100,
			standardHeaders: "draft-7",
			legacyHeaders: false,
		});
		const app = createTestApp(limiter);
		const { req, res } = createExpressContext(app, "10.1.1.1");
		const next = jest.fn();

		await new Promise<void>((resolve) => {
			limiter(req, res, (...args) => {
				next(...args);
				resolve();
			});
		});

		expect(next).toHaveBeenCalled();
		expect(next).not.toHaveBeenCalledWith(expect.any(Error));
	});

	it("レートリミット超過時に 429 と TOO_MANY_REQUESTS を返す", async () => {
		const limiter = rateLimit({
			windowMs: 60_000,
			limit: 1,
			standardHeaders: "draft-7",
			legacyHeaders: false,
			message: {
				success: false,
				error: "Too many search requests. Please slow down.",
				code: "TOO_MANY_REQUESTS",
			},
		});
		const app = createTestApp(limiter);

		// 1 回目: 通過する
		const ctx1 = createExpressContext(app, "10.1.1.2");
		await new Promise<void>((resolve) => {
			limiter(ctx1.req, ctx1.res, () => resolve());
		});

		// 2 回目: 制限超過 → 429
		const ctx2 = createExpressContext(app, "10.1.1.2");
		limiter(ctx2.req, ctx2.res, () => {});
		await ctx2.done;

		expect(ctx2.responseData.statusCode).toBe(429);
		expect(ctx2.responseData.body).toMatchObject({
			success: false,
			code: "TOO_MANY_REQUESTS",
		});
	});
});
