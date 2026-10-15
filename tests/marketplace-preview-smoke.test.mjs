import assert from "node:assert/strict";
import test from "node:test";

const base = process.env.MARKETPLACE_TEST_BASE_URL;
if (!base) throw new Error("MARKETPLACE_TEST_BASE_URL is required");
const origin = new URL(base);
if (origin.protocol !== "https:" || origin.hostname !== "paystack-test.froshcodeorbit.site") {
  throw new Error("Smoke tests may only run against the approved temporary test subdomain");
}

async function request(path, options = {}) {
  const response = await fetch(new URL(path, origin), { ...options, redirect: "manual", signal: AbortSignal.timeout(12000) });
  return response;
}

test("public storefront is reachable without Vercel SSO", async () => {
  const res = await request("/store");
  assert.equal(res.status, 200, "storefront must be public and reachable");
  assert.match(res.headers.get("content-type") || "", /text\/html/);
});

test("unknown template slug does not expose a purchase", async () => {
  const res = await request("/store/this-template-does-not-exist-smoke-test");
  const html = await res.text();
  // Next.js can stream a rendered not-found boundary with HTTP 200.
  assert.ok(res.status === 404 || (res.status === 200 && /not found|404|noindex/i.test(html)));
  assert.doesNotMatch(html, /Buy securely with Paystack/i);
});

test("malformed checkout is rejected before payment initialization", async () => {
  const res = await request("/api/store/checkout", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ templateId: "invalid", email: "not-email" }),
  });
  assert.equal(res.status, 400);
});

test("unsigned Paystack webhook is rejected", async () => {
  const res = await request("/api/store/webhook", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ event: "charge.success", data: { reference: "frosh_smoketest1234" } }),
  });
  assert.equal(res.status, 401);
});

test("malformed fulfillment request cannot issue a ZIP link", async () => {
  const res = await request("/api/store/fulfill", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ reference: "invalid", email: "not-email" }),
  });
  assert.equal(res.status, 400);
  const body = await res.json();
  assert.equal(Object.hasOwn(body, "downloadUrl"), false);
});
