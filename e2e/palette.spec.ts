import { expect, test } from "@playwright/test";

test.use({ viewport: { width: 1280, height: 800 } });

test("Ctrl+K lists shortcuts and toggles blueprint", async ({ page }) => {
  await page.goto("/");
  await page.waitForLoadState("networkidle");
  await page.keyboard.press("Control+k");
  const dialog = page.getByRole("dialog");
  await expect(dialog.getByText("g p")).toBeVisible();
  await dialog.getByRole("option", { name: /blueprint/i }).click();
  await expect(page.locator("html")).toHaveAttribute("data-blueprint", "");
});

test("g p goes to projects without changing mode", async ({ page }) => {
  await page.goto("/");
  await page.waitForLoadState("networkidle");
  const modeAttrs = () => page.locator("html").evaluate((el) => el.getAttributeNames().filter((n) => n.startsWith("data-")).sort().map((n) => `${n}=${el.getAttribute(n)}`));
  const before = await modeAttrs();
  await page.keyboard.press("g");
  await page.keyboard.press("p");
  await expect(page).toHaveURL(/\/projects$/);
  await expect(page.locator("html")).not.toHaveAttribute("data-blueprint", /.*/);
  expect(await modeAttrs()).toEqual(before);
});
