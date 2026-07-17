import assert from "node:assert/strict";
import test from "node:test";

import { canonicalSha256 } from "./sync-metadata.mjs";

test("canonicalSha256 matches the backend's Python serialization", () => {
  const source =
    '{"z":0.0,"a":"é","nested":{"b":1,"a":1e-07},"string":"0.0"}';

  assert.equal(
    canonicalSha256(source),
    "2fb394cbd8ef5a2cb39d3af2c09365b7ff507eee363f991cbea8e08900a4cf2f",
  );
});
