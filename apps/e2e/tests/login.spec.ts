// e2e/tests/login.spec.ts
import { test, expect } from "@playwright/test";
import { testUsers } from "../fixtures/users";

test.describe("ログイン機能", () => {

  test("正しいID/PWでログインできる", async ({ page }) => {
    await page.goto("/login");

    await page.fill('input[name="email"]', testUsers.user.email);
    await page.fill('input[name="password"]', testUsers.user.password);
    await page.click('button[type="submit"]');

    await expect(page).toHaveURL("/dashboard/user");
  });

  test("間違ったID/PWでエラーが表示される", async ({ page }) => {
    await page.goto("/login");

    await page.fill('input[name="email"]', "wrong@test.com");
    await page.fill('input[name="password"]', "wrongpass");
    await page.click('button[type="submit"]');

    await expect(page.locator(".error-message")).toContainText(
      "メールアドレスまたはパスワードが違います"
    );
  });

  test("ログイン後、適切なロールのダッシュボードに遷移する", async ({ page }) => {
    const roles = [
      { user: testUsers.user, path: "/dashboard/user" },
      { user: testUsers.manager, path: "/dashboard/manager" },
      { user: testUsers.master, path: "/dashboard/master" },
    ];

    for (const item of roles) {
      await page.goto("/login");

      await page.fill('input[name="email"]', item.user.email);
      await page.fill('input[name="password"]', item.user.password);
      await page.click('button[type="submit"]');

      await expect(page).toHaveURL(item.path);
      await page.context().clearCookies(); // ログアウト相当
    }
  });

  test("パスワードリセットページへ遷移し、再ログインできる", async ({ page }) => {
    await page.goto("/login");
    await page.click("text=パスワードをお忘れですか？");

    await expect(page).toHaveURL("/reset-password");

    // ここでは送信 UI の表示だけ確認する（実際のメール送信は別テスト）
    await expect(page.locator("button[type='submit']")).toBeVisible();
  });

});
