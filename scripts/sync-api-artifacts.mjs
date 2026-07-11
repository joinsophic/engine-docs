#!/usr/bin/env node

import { createHash } from "node:crypto";
import { mkdir, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { setTimeout as sleep } from "node:timers/promises";
import { pathToFileURL } from "node:url";

const DEFAULT_METADATA_URL = "https://api.engine.usesophic.com/.meta/docs";
const DEFAULT_OPENAPI_URL = "https://api.engine.usesophic.com/openapi.json";
const REVISION_PATTERN = /^[0-9a-f]{8}$/;
const SHA256_PATTERN = /^[0-9a-f]{64}$/;

function parseArguments(argv) {
  const options = {
    metadataUrl: DEFAULT_METADATA_URL,
    openapiUrl: DEFAULT_OPENAPI_URL,
    attempts: 60,
    interval: 10,
    openapiOutput: "openapi.json",
    metadataOutput: "metadata/docs.json",
    errorCodesOutput: "snippets/autogen/error-codes.jsx",
    webhookEventsOutput: "snippets/autogen/webhook-events.jsx",
  };

  for (let index = 0; index < argv.length; index += 2) {
    const name = argv[index];
    const value = argv[index + 1];
    if (!name?.startsWith("--") || value === undefined) {
      throw new Error(`invalid argument: ${name ?? ""}`);
    }

    const key = name
      .slice(2)
      .replace(/-([a-z])/g, (_, letter) => letter.toUpperCase());
    if (!(key in options) && key !== "expectedRevision") {
      throw new Error(`unknown argument: ${name}`);
    }
    options[key] = ["attempts", "interval"].includes(key) ? Number(value) : value;
  }

  options.expectedRevision = options.expectedRevision?.toLowerCase();
  if (!REVISION_PATTERN.test(options.expectedRevision ?? "")) {
    throw new Error("--expected-revision must be an 8-character Git revision");
  }
  if (!Number.isInteger(options.attempts) || options.attempts < 1) {
    throw new Error("--attempts must be a positive integer");
  }
  if (!Number.isInteger(options.interval) || options.interval < 0) {
    throw new Error("--interval must be a non-negative integer");
  }
  return options;
}

async function fetchJson(url) {
  const response = await fetch(url, {
    headers: {
      Accept: "application/json",
      "User-Agent": "engine-docs-sync/1",
    },
    signal: AbortSignal.timeout(30_000),
  });
  if (!response.ok) {
    throw new Error(`${url} returned HTTP ${response.status}`);
  }
  return response.json();
}

function escapeNonAscii(value) {
  return value.replace(/[\u007f-\uffff]/g, (character) => {
    return `\\u${character.charCodeAt(0).toString(16).padStart(4, "0")}`;
  });
}

function canonicalJson(value) {
  if (value === null || typeof value === "boolean") {
    return JSON.stringify(value);
  }
  if (typeof value === "string") {
    return escapeNonAscii(JSON.stringify(value));
  }
  if (typeof value === "number") {
    if (!Number.isFinite(value)) {
      throw new Error("canonical JSON cannot contain non-finite numbers");
    }
    return JSON.stringify(value);
  }
  if (Array.isArray(value)) {
    return `[${value.map(canonicalJson).join(",")}]`;
  }
  if (typeof value === "object") {
    return `{${Object.keys(value)
      .sort()
      .map(
        (key) =>
          `${escapeNonAscii(JSON.stringify(key))}:${canonicalJson(value[key])}`,
      )
      .join(",")}}`;
  }
  throw new Error(`unsupported JSON value: ${typeof value}`);
}

function canonicalSha256(document) {
  return createHash("sha256").update(canonicalJson(document)).digest("hex");
}

function sortJson(value) {
  if (Array.isArray(value)) {
    return value.map(sortJson);
  }
  if (value !== null && typeof value === "object") {
    return Object.fromEntries(
      Object.keys(value)
        .sort()
        .map((key) => [key, sortJson(value[key])]),
    );
  }
  return value;
}

function validateMetadata(metadata, expectedRevision) {
  if (metadata === null || Array.isArray(metadata) || typeof metadata !== "object") {
    throw new Error("metadata response must be a JSON object");
  }

  const required = [
    "schema_version",
    "revision",
    "api_version",
    "webhook_events",
    "error_codes",
    "openapi_sha256",
  ];
  const missing = required.filter((key) => !(key in metadata));
  if (missing.length > 0) {
    throw new Error(`metadata response is missing: ${missing.join(", ")}`);
  }
  if (!REVISION_PATTERN.test(metadata.revision)) {
    throw new Error("metadata revision must be a lowercase 8-character Git revision");
  }
  if (metadata.revision !== expectedRevision) {
    throw new Error(
      `production is serving revision ${metadata.revision}, expected ${expectedRevision}`,
    );
  }
  if (!SHA256_PATTERN.test(metadata.openapi_sha256)) {
    throw new Error("openapi_sha256 must be a lowercase SHA-256 digest");
  }
  if (!Array.isArray(metadata.error_codes)) {
    throw new Error("error_codes must be an array");
  }
  if (!Array.isArray(metadata.webhook_events)) {
    throw new Error("webhook_events must be an array");
  }

  const errorNames = metadata.error_codes.map((item) => item?.code);
  const eventNames = metadata.webhook_events.map((item) => item?.name);
  if (errorNames.some((name) => typeof name !== "string" || name.length === 0)) {
    throw new Error("every error code must have a non-empty code");
  }
  if (eventNames.some((name) => typeof name !== "string" || name.length === 0)) {
    throw new Error("every webhook event must have a non-empty name");
  }
  if (new Set(errorNames).size !== errorNames.length) {
    throw new Error("metadata contains duplicate error codes");
  }
  if (new Set(eventNames).size !== eventNames.length) {
    throw new Error("metadata contains duplicate webhook event names");
  }

  return {
    ...metadata,
    error_codes: metadata.error_codes.toSorted((left, right) =>
      left.code.localeCompare(right.code),
    ),
    webhook_events: metadata.webhook_events.toSorted((left, right) =>
      left.name.localeCompare(right.name),
    ),
  };
}

async function writeJson(path, value) {
  await mkdir(dirname(path), { recursive: true });
  await writeFile(path, `${JSON.stringify(sortJson(value), null, 2)}\n`, "utf8");
}

async function writeGeneratedArray(path, exportName, data) {
  const content = [
    "// Generated from metadata/docs.json. Do not edit manually.",
    "",
    `export const ${exportName} = ${JSON.stringify(data, null, 2)};`,
    "",
  ].join("\n");

  await mkdir(dirname(path), { recursive: true });
  await writeFile(path, content, "utf8");
}

async function syncArtifacts(options) {
  let metadata;
  let openapi;
  let lastError;

  for (let attempt = 1; attempt <= options.attempts; attempt += 1) {
    try {
      metadata = validateMetadata(
        await fetchJson(options.metadataUrl),
        options.expectedRevision,
      );
      openapi = await fetchJson(options.openapiUrl);
      const actualDigest = canonicalSha256(openapi);
      if (actualDigest !== metadata.openapi_sha256) {
        throw new Error(
          `production OpenAPI digest is ${actualDigest}, expected ${metadata.openapi_sha256}`,
        );
      }
      lastError = undefined;
      break;
    } catch (error) {
      lastError = error;
      if (attempt < options.attempts) {
        console.log(
          `Attempt ${attempt}/${options.attempts} did not converge: ${error.message}`,
        );
        await sleep(options.interval * 1_000);
      }
    }
  }

  if (lastError !== undefined) {
    throw new Error(
      `production metadata did not converge after ${options.attempts} attempts: ${lastError.message}`,
    );
  }

  const { revision: _revision, ...snapshot } = metadata;
  await writeJson(options.openapiOutput, openapi);
  await writeJson(options.metadataOutput, snapshot);
  await writeGeneratedArray(
    options.errorCodesOutput,
    "errorCodes",
    snapshot.error_codes,
  );
  await writeGeneratedArray(
    options.webhookEventsOutput,
    "webhookEvents",
    snapshot.webhook_events,
  );
}

export { canonicalSha256, writeGeneratedArray, writeJson };

if (
  process.argv[1] &&
  import.meta.url === pathToFileURL(resolve(process.argv[1])).href
) {
  try {
    await syncArtifacts(parseArguments(process.argv.slice(2)));
  } catch (error) {
    console.error(error.message);
    process.exitCode = 1;
  }
}
