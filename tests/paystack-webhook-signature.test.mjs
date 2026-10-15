import assert from "node:assert/strict";
import { createHmac } from "node:crypto";
import test from "node:test";
import { isValidPaystackSignature } from "../src/lib/paystack-webhook-signature.ts";

const secret = "sk_test_sample_only_never_real";
const body = JSON.stringify({ event: "charge.success", data: { reference: "frosh_example_12345678" } });
const signature = createHmac("sha512", secret).update(body).digest("hex");

test("accepts exact valid Paystack HMAC signature", () => {
  assert.equal(isValidPaystackSignature(body, signature, secret), true);
  assert.equal(isValidPaystackSignature(body, signature.toUpperCase(), secret), true);
});

test("rejects missing, malformed, empty, and wrong-key signatures", () => {
  assert.equal(isValidPaystackSignature(body, null, secret), false);
  assert.equal(isValidPaystackSignature(body, "", secret), false);
  assert.equal(isValidPaystackSignature(body, "abc", secret), false);
  assert.equal(isValidPaystackSignature(body, "z".repeat(128), secret), false);
  assert.equal(isValidPaystackSignature(body, signature, undefined), false);
  assert.equal(isValidPaystackSignature(body, signature, "wrong-key"), false);
});

test("rejects one-byte tampering and whitespace changes to raw body", () => {
  assert.equal(isValidPaystackSignature(body + " ", signature, secret), false);
  assert.equal(isValidPaystackSignature(body.replace("charge.success", "charge.failed"), signature, secret), false);
});

test("replayed authentic signature is valid; idempotency must happen downstream", () => {
  assert.equal(isValidPaystackSignature(body, signature, secret), true);
  assert.equal(isValidPaystackSignature(body, signature, secret), true);
});
