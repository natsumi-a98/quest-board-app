import { beforeEach, describe, expect, it } from "vitest";
import {
	buildQuestSearchHistory,
	persistQuestSearchHistory,
	QUEST_SEARCH_HISTORY_KEY,
	readQuestSearchHistory,
} from "@/components/organisms/questSearchHistory";

describe("questSearchHistory", () => {
	beforeEach(() => {
		window.localStorage.clear();
	});

	it("同じ検索語は先頭へ移動しつつ重複を除く", () => {
		expect(
			buildQuestSearchHistory(["React", "Next.js", "React Native"], "Next.js"),
		).toEqual(["Next.js", "React", "React Native"]);
	});

	it("履歴は最大5件まで保持する", () => {
		expect(buildQuestSearchHistory(["1", "2", "3", "4", "5"], "6")).toEqual([
			"6",
			"1",
			"2",
			"3",
			"4",
		]);
	});

	it("localStorage へ保存した履歴を読み戻せる", () => {
		persistQuestSearchHistory("React");
		persistQuestSearchHistory("Next.js");

		expect(readQuestSearchHistory()).toEqual(["Next.js", "React"]);
		expect(window.localStorage.getItem(QUEST_SEARCH_HISTORY_KEY)).toBe(
			JSON.stringify(["Next.js", "React"]),
		);
	});
});
