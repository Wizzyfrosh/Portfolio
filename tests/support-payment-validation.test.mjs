import assert from "node:assert/strict";
import test from "node:test";
import { parseSupportAmount, validSupportEmail } from "../src/lib/support-validation.ts";

test("only bounded, exact NGN support amounts convert to kobo", () => {
  assert.equal(parseSupportAmount(100), 10000);
  assert.equal(parseSupportAmount(1000), 100000);
  assert.equal(parseSupportAmount(1000000), 100000000);
  for (const input of [99.99, 1000000.01, 0, -100, 100.001, NaN, Infinity, "1000", null, undefined]) {
    assert.equal(parseSupportAmount(input), null, String(input));
  }
});
test("support email validation rejects malformed and oversized inputs", () => {
  assert.equal(validSupportEmail("supporter@example.com"), true);
  for (const value of ["", "not-email", "test@missing", "a".repeat(255) + "@example.com", null, {}]) {
    assert.equal(validSupportEmail(value), false);
  }
});
