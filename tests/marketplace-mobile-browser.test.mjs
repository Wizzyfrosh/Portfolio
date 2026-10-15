import assert from "node:assert/strict";
import test from "node:test";
import { chromium } from "playwright";

const base = "https://paystack-test.froshcodeorbit.site";
test("mobile storefront, form and access smoke", async () => {
  const browser = await chromium.launch({ headless: true });
  try {
    const context = await browser.newContext({
      viewport: { width: 390, height: 844 }, deviceScaleFactor: 2,
      isMobile: true, hasTouch: true,
    });
    const page = await context.newPage();
    await page.goto(base + "/store", { waitUntil: "domcontentloaded", timeout: 30000 });
    assert.match(await page.title(), /frosh|template|store|codeorbit/i);
    assert.equal(await page.locator("body").isVisible(), true);
    const sizes = await page.evaluate(() => ({
      pageWidth: document.documentElement.scrollWidth,
      viewportWidth: window.innerWidth
    }));
    assert.ok(sizes.pageWidth <= sizes.viewportWidth + 5, "Storefront must not overflow horizontally");
    const templateLink = page.locator("a[href^='/store/']").filter({ hasNotText: /recover/i }).first();
    assert.ok(await templateLink.count() > 0, "Published template link must be present");
    await templateLink.click();
    assert.equal(await page.getByRole("button", { name: /buy securely with paystack/i }).isVisible(), true);
    assert.equal(await page.locator("input[type=email]").isVisible(), true);
    await page.goto(base + "/store/recover", { waitUntil: "domcontentloaded" });
    assert.equal(await page.getByRole("heading", { name: /recover your template/i }).isVisible(), true);
    await page.goto(base + "/admin/login", { waitUntil: "domcontentloaded" });
    assert.ok(!page.url().includes("/admin/dashboard"), "Anonymous visitor must not reach admin dashboard");
  } finally {
    await browser.close();
  }
});
