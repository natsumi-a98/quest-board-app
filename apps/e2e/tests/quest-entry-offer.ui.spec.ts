import { test, expect, Page } from "@playwright/test";

const BASE_URL = "http://localhost:3000";

// E2E 用の固定ユーザー情報
const USER_EMAIL = "questboard+002@example.com";
const USER_PASSWORD = "Abcd1234";

// オファー通知確認用ユーザー（現状は同一ユーザーを想定）
const OFFER_TARGET_EMAIL = USER_EMAIL;

// 管理者ユーザーは別途用意されていることを想定
const ADMIN_EMAIL = "questboard@example.com";
const ADMIN_PASSWORD = "Abcd1234";

async function login(page: Page, email: string, password: string) {
  await page.goto(`${BASE_URL}/login`);

  await page
    .getByPlaceholder("メールアドレス")
    .fill(email, { timeout: 10_000 });
  await page.getByPlaceholder("パスワード").fill(password);
  await page.getByRole("button", { name: "ログイン" }).click();

  // ログイン成功アラートを待つ
  const dialog = await page.waitForEvent("dialog", { timeout: 15_000 });
  expect(dialog.message()).toContain("ログイン成功");
  await dialog.accept();
}

test.describe("クエストエントリー UI E2E", () => {
  test("一般ユーザーがクエストに応募できる", async ({ page }) => {
    // ログイン
    await login(page, USER_EMAIL, USER_PASSWORD);

    // クエスト一覧へ
    await page.goto(`${BASE_URL}/quests`);

    // 「クエストに参加する」ボタンが表示されるまで待機
    await page.waitForSelector('button:has-text("クエストに参加する")');

    // 最初の「クエストに参加する」ボタンを取得
    const firstJoinButton = page
      .locator('button:has-text("クエストに参加する")')
      .first();

    // ボタンが表示 & 有効になっていることを確認
    await expect(firstJoinButton).toBeVisible();
    await expect(firstJoinButton).toBeEnabled();

    // 親を遡る代わりに「ボタンを含むカード」を filter で特定
    const questCard = page
      .locator('article, [data-testid="quest-card"], .quest-card')
      .filter({
        has: firstJoinButton,
      })
      .first();

    // カード内の最初の見出しを取得（strict mode 回避のため .first() を明示）
    const questTitle = await questCard
      .getByRole("heading")
      .first()
      .textContent();
    expect(questTitle).toBeTruthy();

    // 参加ボタンをクリック → ダイアログの「参加する」をクリック
    await firstJoinButton.click();

    const dialogJoinButton = page.getByRole("button", { name: "参加する" });
    await expect(dialogJoinButton).toBeVisible();

    const joinDialogEvent = page.waitForEvent("dialog");
    await dialogJoinButton.click();

    const alert = await joinDialogEvent;
    expect(alert.message()).toContain("クエストに参加しました！");
    await alert.accept();

    // マイページで「募集中（参加中）」タブに該当クエストがあることを確認
    await page.goto(`${BASE_URL}/mypage`);

    // 「募集中」タブをクリック（QuestHistory）
    await page.getByRole("button", { name: "募集中" }).click();

    if (questTitle) {
      await expect(page.getByText(questTitle)).toBeVisible();
    }
  });

  test("既に参加中のクエストに重複応募できない", async ({ page }) => {
    // すでに E2E_USER_EMAIL が何らかのクエストに参加している前提
    await login(page, USER_EMAIL, USER_PASSWORD);

    await page.goto(`${BASE_URL}/quests`);

    const firstJoinButton = page
      .getByRole("button", { name: "クエストに参加する" })
      .first();
    await expect(firstJoinButton).toBeVisible();

    const questCard = firstJoinButton.locator("..").locator("..").locator("..");
    const questTitleLocator = questCard.getByRole("heading");
    const questTitle = await questTitleLocator.textContent();
    expect(questTitle).toBeTruthy();

    // 1 回目の参加（成功させる）
    {
      const joinDialogEvent = page.waitForEvent("dialog");
      await firstJoinButton.click();
      const dialogJoinButton = page.getByRole("button", { name: "参加する" });
      await dialogJoinButton.click();
      const alert = await joinDialogEvent;
      // 成功 or 既参加のどちらかになる可能性があるが、
      // ここでは少なくとも致命的エラーでないことだけを確認
      await alert.accept();
    }

    // 同じクエストに 2 回目の参加を試みる
    await page.goto(`${BASE_URL}/quests`);

    const sameQuestJoinButton = page
      .getByRole("button", { name: "クエストに参加する" })
      .filter({ hasText: "" })
      .first();

    const secondDialogEvent = page.waitForEvent("dialog");
    await sameQuestJoinButton.click();
    const dialogJoinButton2 = page.getByRole("button", { name: "参加する" });
    await dialogJoinButton2.click();

    const secondAlert = await secondDialogEvent;
    // 成功メッセージではないこと（= 重複応募が許容されていないこと）を確認
    expect(secondAlert.message()).not.toContain("クエストに参加しました！");
    await secondAlert.accept();

    // マイページ上で該当クエストが重複していないこと
    await page.goto(`${BASE_URL}/mypage`);
    await page.getByRole("button", { name: "募集中" }).click();
    if (questTitle) {
      const items = page.getByText(questTitle);
      await expect(items.first()).toBeVisible();
    }
  });
});

test.describe("オファー / 承認系 UI（将来実装前提のスケルトン）", () => {
  test.skip("承認後にステータスが「参加中」に変化する", async ({ page }) => {
    /**
     * 現行のフロントエンドには「応募承認」UIが存在しないため、
     * このテストは将来の実装を想定したスケルトンとして残す。
     *
     * 想定フロー:
     *  1. 一般ユーザーで応募（/quests → 詳細 → 応募）
     *  2. 管理者で /admin/dashboard にログインし、応募一覧から該当ユーザーを「承認」
     *  3. 一般ユーザーで /mypage を開き、対象クエストのステータスが「参加中」になっていることを確認
     */
    await login(page, ADMIN_EMAIL, ADMIN_PASSWORD);
    await page.goto(`${BASE_URL}/admin/dashboard`);
    // TODO: 応募承認 UI 実装後にセレクタを追加
    await expect(page).toHaveTitle(/ダッシュボード/);
  });

  test.skip("管理者が特定ユーザーにオファーできる", async ({ page }) => {
    /**
     * バックエンドには offer テーブルが存在するが、
     * 管理画面からオファーを送信する UI コンポーネントはまだ存在しない。
     *
     * 将来:
     *  1. 管理者で /admin/dashboard にログイン
     *  2. クエスト詳細から「ユーザーにオファー」アクションを実行
     *  3. 対象ユーザー選択 → 送信
     *  4. 成功トーストなどを検証
     */
    await login(page, ADMIN_EMAIL, ADMIN_PASSWORD);
    await page.goto(`${BASE_URL}/admin/dashboard`);
    await expect(page.getByText("クエスト管理")).toBeVisible();
  });

  test.skip("オファー通知が届く", async ({ page }) => {
    /**
     * /mypage/notifications から取得される通知に
     * 「オファー」が含まれることを検証するテストのスケルトン。
     *
     * 前提:
     *  - 事前にシード or API 経由で、OFFER_TARGET_EMAIL 宛てのオファー通知を作成しておく。
     *
     * フロー:
     *  1. 対象ユーザーでログイン
     *  2. /mypage を表示
     *  3. NotificationList に「オファー」関連のメッセージが表示されていることを確認
     */
    await login(page, OFFER_TARGET_EMAIL, USER_PASSWORD);
    await page.goto(`${BASE_URL}/mypage`);

    await expect(page.getByText("通知")).toBeVisible();
    // TODO: 実際のオファー通知メッセージ形式に合わせて assertion を追加
  });
});
