import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import {
	QuestDifficulty,
	QuestStatus,
	QuestType,
	type Quest,
} from "@quest-board/types";
import QuestList from "@/components/organisms/QuestList";
import { QUEST_SEARCH_HISTORY_KEY } from "@/components/organisms/questSearchHistory";

vi.mock("next/navigation", () => ({
	useRouter: () => ({
		push: vi.fn(),
	}),
}));

vi.mock("@/hooks/useAuth", () => ({
	useAuth: () => ({
		user: null,
		isAuthenticated: false,
		loading: false,
	}),
}));

const questServiceMock = vi.hoisted(() => ({
	getAllQuests: vi.fn(),
}));

vi.mock("@/services/quest", () => ({
	questService: questServiceMock,
}));

vi.mock("@/services/review", () => ({
	reviewService: {
		checkUserReviewExists: vi.fn(),
	},
}));

vi.mock("@/services/user", () => ({
	userService: {
		getCurrentUser: vi.fn(),
	},
}));

vi.mock("@/components/organisms/QuestJoinDialog", () => ({
	default: () => null,
}));

vi.mock("@/components/organisms/QuestListCard", () => ({
	__esModule: true,
	default: ({ quest }: { quest: Quest }) => (
		<div data-testid="quest-card">{quest.title}</div>
	),
}));

const createQuest = (overrides: Partial<Quest>): Quest => ({
	id: overrides.id ?? 1,
	title: overrides.title ?? "Quest Title",
	description: overrides.description ?? "Quest Description",
	type: overrides.type ?? QuestType.Development,
	status: overrides.status ?? QuestStatus.Active,
	start_date: overrides.start_date ?? "2026-03-10T00:00:00.000Z",
	end_date: overrides.end_date ?? "2026-03-20T00:00:00.000Z",
	created_at: overrides.created_at ?? "2026-03-01T00:00:00.000Z",
	updated_at: overrides.updated_at ?? "2026-03-01T00:00:00.000Z",
	deleted_at: overrides.deleted_at,
	rewards: overrides.rewards ?? {
		incentive_amount: 1000,
		point_amount: 10,
		note: "reward",
	},
	quest_participants: overrides.quest_participants ?? [],
	_count: overrides._count ?? { quest_participants: 0 },
	maxParticipants: overrides.maxParticipants ?? 5,
	tags: overrides.tags ?? [],
	difficulty: overrides.difficulty ?? QuestDifficulty.Beginner,
	icon: overrides.icon,
});

describe("QuestList", () => {
	beforeEach(() => {
		window.localStorage.clear();
		questServiceMock.getAllQuests.mockResolvedValue([
			createQuest({ id: 1, title: "React Quest" }),
			createQuest({ id: 2, title: "Next Quest" }),
		]);
	});

	it("検索欄をクリックすると検索履歴を表示し、選択すると即座に再検索する", async () => {
		window.localStorage.setItem(
			QUEST_SEARCH_HISTORY_KEY,
			JSON.stringify(["Next Quest", "React Quest"]),
		);

		render(<QuestList />);

		expect(await screen.findAllByTestId("quest-card")).toHaveLength(2);

		const searchInput = screen.getByPlaceholderText("クエストを検索...");
		fireEvent.focus(searchInput);

		expect(await screen.findByText("検索履歴")).toBeInTheDocument();

		fireEvent.click(screen.getByRole("button", { name: "Next Quest" }));

		await waitFor(() => {
			expect(screen.getAllByTestId("quest-card")).toHaveLength(1);
		});

		expect(screen.getByTestId("quest-card")).toHaveTextContent("Next Quest");
		expect(searchInput).toHaveValue("Next Quest");
	});

	it("入力後に blur すると検索履歴を保存する", async () => {
		render(<QuestList />);

		await screen.findAllByTestId("quest-card");

		const searchInput = screen.getByPlaceholderText("クエストを検索...");
		fireEvent.change(searchInput, { target: { value: "React Quest" } });
		fireEvent.blur(searchInput);

		await waitFor(() => {
			expect(window.localStorage.getItem(QUEST_SEARCH_HISTORY_KEY)).toBe(
				JSON.stringify(["React Quest"]),
			);
		});
	});
});
