import { test, expect, request } from "@playwright/test";

const BASE_URL = "http://localhost:3000"; // サーバー起動ポートに合わせて調整

test.describe("レビューAPI E2Eテスト", () => {
  let questId: number;
  let userId: number;
  let reviewId: number;

  test.beforeAll(async () => {
    // テストデータ作成
    questId = 101;
    userId = 999; // テストユーザーID（テストDBに存在する想定 or モックユーザー）

    // 念のため古いデータ削除（存在してもエラーにしない）
    const context = await request.newContext();
    await context.delete(`${BASE_URL}/reviews/${questId}/${userId}`).catch(() => {});
  });

  // レビュー作成
  test("POST /reviews/:questId — 新規レビュー作成できる", async ({ request }) => {
    const response = await request.post(`${BASE_URL}/reviews/${questId}`, {
      data: {
        reviewer_id: userId,
        rating: 4,
        comment: "とても良いクエストでした！",
      },
    });

    expect(response.status()).toBe(201);

    const body = await response.json();
    expect(body).toHaveProperty("id");
    expect(body.questId).toBe(questId);
    expect(body.reviewer_id).toBe(userId);

    reviewId = body.id;
  });

  // 重複投稿制限
  test("POST /reviews/:questId — 同一ユーザーは重複投稿できない", async ({ request }) => {
    const response = await request.post(`${BASE_URL}/reviews/${questId}`, {
      data: {
        reviewer_id: userId,
        rating: 5,
        comment: "再投稿テスト",
      },
    });

    expect(response.status()).toBe(400);
    const body = await response.json();
    expect(body.message).toContain("既にレビューを投稿済み");
  });

  // レビュー一覧取得
  test("GET /reviews/:questId — クエストのレビュー一覧を取得できる", async ({ request }) => {
    const response = await request.get(`${BASE_URL}/reviews/${questId}`);
    expect(response.status()).toBe(200);

    const reviews = await response.json();
    expect(Array.isArray(reviews)).toBe(true);
    expect(reviews.some((r: any) => r.id === reviewId)).toBe(true);
  });

  // レビュー更新
  test("PUT /reviews/:reviewId — レビューを更新できる", async ({ request }) => {
    const response = await request.put(`${BASE_URL}/reviews/${reviewId}`, {
      data: {
        rating: 3,
        comment: "やや難しかったが楽しい！",
      },
    });

    expect(response.status()).toBe(200);
    const updated = await response.json();
    expect(updated.rating).toBe(3);
    expect(updated.comment).toContain("楽しい");
  });

  // 投稿済み確認
  test("GET /reviews/check/:userId/:questId — 投稿済みか確認できる", async ({ request }) => {
    const response = await request.get(`${BASE_URL}/reviews/check/${userId}/${questId}`);
    expect(response.status()).toBe(200);

    const body = await response.json();
    expect(body.exists).toBe(true);
  });

  // レビュー削除
  test("DELETE /reviews/:reviewId — レビューを削除できる", async ({ request }) => {
    const response = await request.delete(`${BASE_URL}/reviews/${reviewId}`);
    expect(response.status()).toBe(204);
  });

  // 削除後確認
  test("GET /reviews/check/:userId/:questId — 削除後はfalseになる", async ({ request }) => {
    const response = await request.get(`${BASE_URL}/reviews/check/${userId}/${questId}`);
    expect(response.status()).toBe(200);

    const body = await response.json();
    expect(body.exists).toBe(false);
  });
});
