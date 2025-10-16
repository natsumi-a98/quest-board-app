import { test, expect, request } from "@playwright/test";

const BASE_URL = "http://localhost:3000"; // バックエンドのURL

test.describe("Quest API E2E Test", () => {
  let apiContext: any;
  let createdQuestId: number | null = null;

  test.beforeAll(async ({ playwright }) => {
    // PlaywrightのAPIRequestContextを作成
    apiContext = await request.newContext({
      baseURL: BASE_URL,
    });
  });

  test("POST /api/quests で新規クエストを作成できる", async () => {
    const newQuest = {
      title: "テストクエスト",
      description: "E2Eテスト用のクエストです。",
      reward: 100,
    };

    const response = await apiContext.post("/api/quests", {
      data: newQuest,
    });

    expect(response.ok()).toBeTruthy();

    const body = await response.json();
    expect(body).toHaveProperty("id");
    expect(body.title).toBe(newQuest.title);
    expect(body.reward).toBe(newQuest.reward);

    // 後で確認用にIDを保存
    createdQuestId = body.id;
  });

  test("GET /api/quests で作成したクエストを取得できる", async () => {
    const response = await apiContext.get("/api/quests");
    expect(response.ok()).toBeTruthy();

    const quests = await response.json();
    const found = quests.find((q: any) => q.id === createdQuestId);

    expect(found).toBeTruthy();
    expect(found.title).toBe("テストクエスト");
  });

  test.afterAll(async () => {
    if (createdQuestId) {
      // テストデータ削除（存在する場合のみ）
      await apiContext.delete(`/api/quests/${createdQuestId}`);
    }
    await apiContext.dispose();
  });
});
