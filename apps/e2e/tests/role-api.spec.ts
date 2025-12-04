// e2e/tests/role-api.spec.ts
import { test, expect, request } from "@playwright/test";
import { testUsers } from "../fixtures/users";

const getIdToken = async (page, email, password) => {
  await page.goto("/login");
  await page.fill('input[name="email"]', email);
  await page.fill('input[name="password"]', password);
  await page.click("button[type=submit]");

  const token = await page.evaluate(() => {
    return window.localStorage.getItem("authToken");
  });

  return token;
};

test.describe("API ロール制御", () => {
  test("一般ユーザーはユーザー一覧を取得できない", async ({ page }) => {
    const token = await getIdToken(page, testUsers.user.email, testUsers.user.password);

    const api = await request.newContext({
      baseURL: "http://localhost:3001",
      extraHTTPHeaders: {
        Authorization: `Bearer ${token}`,
      },
    });

    const res = await api.get("/api/admin/users");

    expect(res.status()).toBe(403);
  });

  test("マネージャーはユーザー一覧を取得できる", async ({ page }) => {
    const token = await getIdToken(page, testUsers.manager.email, testUsers.manager.password);

    const api = await request.newContext({
      baseURL: "http://localhost:3001",
      extraHTTPHeaders: {
        Authorization: `Bearer ${token}`,
      },
    });

    const res = await api.get("/api/admin/users");

    expect(res.status()).toBe(200);
  });
});
