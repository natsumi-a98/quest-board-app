process.env.DATABASE_URL =
	process.env.DATABASE_URL ?? "mysql://user:password@localhost:3306/test_db";

const questsRouter = require("../../routes/quests").default;
const reviewsRouter = require("../../routes/reviews").default;
const authMiddleware =
	require("../../middlewares/auth.middleware").authMiddleware;

type RouteMethod = "get" | "post" | "put" | "patch" | "delete";

type RouteStackLayer = {
	handle: unknown;
	route?: {
		path: string;
		methods: Partial<Record<RouteMethod, boolean>>;
		stack: RouteStackLayer[];
	};
};

const getRouteHandlers = (
	router: typeof questsRouter,
	method: RouteMethod,
	path: string,
) => {
	const routeLayer = (router as { stack: RouteStackLayer[] }).stack.find(
		(layer) =>
			layer.route && layer.route.path === path && layer.route.methods[method],
	);

	if (!routeLayer) {
		throw new Error(`Route not found: ${method.toUpperCase()} ${path}`);
	}

	if (!routeLayer.route) {
		throw new Error(`Route stack is missing: ${method.toUpperCase()} ${path}`);
	}

	return routeLayer.route.stack.map((layer) => layer.handle);
};

describe("認証保護ルート", () => {
	it("POST /quests/:questId/reviews は authMiddleware を必須にする", () => {
		const handlers = getRouteHandlers(
			questsRouter,
			"post",
			"/:questId/reviews",
		);

		expect(handlers).toContain(authMiddleware);
	});

	it("PUT /reviews/:reviewId は authMiddleware を必須にする", () => {
		const handlers = getRouteHandlers(reviewsRouter, "put", "/:reviewId");

		expect(handlers).toContain(authMiddleware);
	});

	it("DELETE /reviews/:reviewId は authMiddleware を必須にする", () => {
		const handlers = getRouteHandlers(reviewsRouter, "delete", "/:reviewId");

		expect(handlers).toContain(authMiddleware);
	});
});
