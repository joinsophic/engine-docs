import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";

import {
  auditApiReferenceLinks,
  buildEndpointIndex,
  slugify,
  suggestEndpointPath,
} from "./audit-links.mjs";

const sampleOpenApi = {
  paths: {
    "/events": {
      get: {
        tags: ["events"],
        summary: "List events",
      },
    },
    "/instruments": {
      get: {
        tags: ["catalog"],
        summary: "List instruments",
      },
    },
    "/persons/{id}/authorities": {
      get: {
        tags: ["customers"],
        summary: "List authorities for a person",
      },
    },
  },
};

test("slugify lowercases and hyphenates summaries", () => {
  assert.equal(
    slugify("List Customer Account Ownerships"),
    "list-customer-account-ownerships",
  );
  assert.equal(slugify("Update Position"), "update-position");
});

test("buildEndpointIndex uses tag and summary slugs", () => {
  const index = buildEndpointIndex(sampleOpenApi);

  assert.equal(index.validPaths.has("/api-reference/events/list-events"), true);
  assert.equal(
    index.validPaths.has("/api-reference/catalog/list-instruments"),
    true,
  );
  assert.deepEqual(index.pathsBySlug.get("list-events"), [
    "/api-reference/events/list-events",
  ]);
});

test("suggestEndpointPath maps flat slugs to tagged paths", () => {
  const index = buildEndpointIndex(sampleOpenApi);

  assert.equal(
    suggestEndpointPath("/api-reference/list-events", index),
    "/api-reference/events/list-events",
  );
  assert.equal(
    suggestEndpointPath("/api-reference/positions/update-position", index),
    undefined,
  );
});

test("auditApiReferenceLinks accepts static topic pages", () => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "audit-links-"));
  fs.mkdirSync(path.join(root, "api-reference"), { recursive: true });
  fs.mkdirSync(path.join(root, "docs"), { recursive: true });
  fs.writeFileSync(
    path.join(root, "api-reference", "auth.mdx"),
    "---\ntitle: Auth\n---\nSee [Auth](/api-reference/auth).\n",
  );
  fs.writeFileSync(
    path.join(root, "docs", "intro.mdx"),
    "---\ntitle: Intro\n---\nSee [Events](/api-reference/events/list-events).\n",
  );

  const issues = auditApiReferenceLinks({ root, openapi: sampleOpenApi });
  assert.deepEqual(issues, []);

  fs.rmSync(root, { recursive: true, force: true });
});

test("auditApiReferenceLinks reports flat endpoint slugs", () => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "audit-links-"));
  fs.mkdirSync(path.join(root, "api-reference"), { recursive: true });
  fs.mkdirSync(path.join(root, "docs"), { recursive: true });
  fs.writeFileSync(
    path.join(root, "docs", "intro.mdx"),
    "---\ntitle: Intro\n---\nBroken [List events](/api-reference/list-events).\n",
  );

  const issues = auditApiReferenceLinks({ root, openapi: sampleOpenApi });

  assert.equal(issues.length, 1);
  assert.equal(issues[0].file, "docs/intro.mdx");
  assert.equal(issues[0].href, "/api-reference/list-events");
  assert.equal(issues[0].suggestion, "/api-reference/events/list-events");

  fs.rmSync(root, { recursive: true, force: true });
});

test("audit-links CLI runs main via the entry guard", () => {
  const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
  const script = fileURLToPath(new URL("./audit-links.mjs", import.meta.url));
  const result = spawnSync(process.execPath, [script], {
    cwd: repoRoot,
    encoding: "utf8",
  });

  assert.equal(result.status, 0, result.stderr || result.stdout);
  assert.match(result.stdout, /All \/api-reference\/ links resolve/);
});
