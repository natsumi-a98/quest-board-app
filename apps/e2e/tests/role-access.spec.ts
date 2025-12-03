import { test, expect } from "@playwright/test";
import { testUsers } from "../fixtures/users";

const login = async (page, email, password) => {
  await page.goto("/login");
  await page.fill('input[name="email"]', email);
  await page.fill('input[name="password"]', password);
  await page.click("button[type=submit]");
};

test.describe("ロール制御（画面アクセス）", () => {
  test("一般ユーザーは管理画面にアクセスできない", async ({ page }) => {
    await login(page, testUsers.user.email, testUsers.user.password);

    await page.goto("/admin/users");

    await expect(page.locator("body")).toContainText("アクセス権限がありません");
  });

  test("マネージャーは管理画面にアクセスできる", async ({ page }) => {
    await login(page, testUsers.manager.email, testUsers.manager.password);

    await page.goto("/admin/users");

    await expect(page).toHaveURL("/admin/users");
    await expect(page.locator("h1")).toContainText("ユーザー管理");
  });

  test("URL直打ちで不正アクセスできない", async ({ page }) => {
    await login(page, testUsers.user.email, testUsers.user.password);

    await page.goto("/admin/settings");

    await expect(page.locator("body")).toContainText("アクセス権限がありません");
  });
});
