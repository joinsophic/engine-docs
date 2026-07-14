import fs from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";

const MARKDOWN_LINK_PATTERN = /\]\((\/api-reference\/[^)#]+)(?:#[^)]+)?\)/g;
const JSX_HREF_PATTERN = /href="(\/api-reference\/[^"#]+)(?:#[^"]+)?"/g;

/**
 * @param {string} content
 * @returns {string[]}
 */
export function extractApiReferenceLinks(content) {
  const hrefs = new Set();

  for (const pattern of [MARKDOWN_LINK_PATTERN, JSX_HREF_PATTERN]) {
    for (const match of content.matchAll(pattern)) {
      hrefs.add(match[1]);
    }
  }

  return [...hrefs];
}

/** @param {string} text */
export function slugify(text) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/**
 * @param {import("openapi-types").OpenAPIV3.Document | Record<string, unknown>} openapi
 * @returns {{ validPaths: Set<string>, pathsBySlug: Map<string, string[]> }}
 */
export function buildEndpointIndex(openapi) {
  const validPaths = new Set();
  const pathsBySlug = new Map();

  for (const operations of Object.values(openapi.paths ?? {})) {
    if (!operations || typeof operations !== "object") {
      continue;
    }

    for (const operation of Object.values(operations)) {
      if (!operation || typeof operation !== "object" || !("summary" in operation)) {
        continue;
      }

      const summary = operation.summary;
      const tag = operation.tags?.[0];
      if (typeof summary !== "string" || typeof tag !== "string") {
        continue;
      }

      const href = `/api-reference/${tag}/${slugify(summary)}`;
      validPaths.add(href);

      const slug = slugify(summary);
      const existing = pathsBySlug.get(slug) ?? [];
      existing.push(href);
      pathsBySlug.set(slug, existing);
    }
  }

  return { validPaths, pathsBySlug };
}

/**
 * @param {string} root
 * @returns {Set<string>}
 */
export function loadStaticTopicPaths(root) {
  const topicDir = path.join(root, "api-reference");
  const staticPaths = new Set();

  for (const entry of fs.readdirSync(topicDir, { withFileTypes: true })) {
    if (entry.isFile() && entry.name.endsWith(".mdx")) {
      staticPaths.add(`/api-reference/${entry.name.replace(/\.mdx$/, "")}`);
    }
  }

  return staticPaths;
}

/**
 * @param {string} href
 * @param {{ validPaths: Set<string>, pathsBySlug: Map<string, string[]> }} index
 * @returns {string | undefined}
 */
export function suggestEndpointPath(href, index) {
  const remainder = href.slice("/api-reference/".length);
  const parts = remainder.split("/");

  if (parts.length === 1) {
    const matches = index.pathsBySlug.get(parts[0]) ?? [];
    if (matches.length === 1) {
      return matches[0];
    }
    return undefined;
  }

  if (parts.length === 2) {
    const slug = parts[1];
    const matches = (index.pathsBySlug.get(slug) ?? []).filter(
      (candidate) => candidate !== href,
    );
    if (matches.length === 1) {
      return matches[0];
    }
  }

  return undefined;
}

/**
 * @param {{ root?: string, openapi?: Record<string, unknown> }} options
 * @returns {{ file: string, href: string, suggestion?: string }[]}
 */
export function auditApiReferenceLinks({ root = process.cwd(), openapi }) {
  const spec =
    openapi ??
    JSON.parse(fs.readFileSync(path.join(root, "openapi.json"), "utf8"));
  const index = buildEndpointIndex(spec);
  const staticPaths = loadStaticTopicPaths(root);
  const issues = [];

  for (const filePath of fs
    .readdirSync(root, { recursive: true })
    .filter((entry) => typeof entry === "string" && entry.endsWith(".mdx"))
    .map((entry) => path.join(root, entry))) {
    const content = fs.readFileSync(filePath, "utf8");

    for (const href of extractApiReferenceLinks(content)) {
      if (staticPaths.has(href) || index.validPaths.has(href)) {
        continue;
      }

      issues.push({
        file: path.relative(root, filePath),
        href,
        suggestion: suggestEndpointPath(href, index),
      });
    }
  }

  return issues.sort((a, b) =>
    a.file === b.file
      ? a.href.localeCompare(b.href)
      : a.file.localeCompare(b.file),
  );
}

function main() {
  const root = process.cwd();
  const issues = auditApiReferenceLinks({ root });

  if (issues.length === 0) {
    console.log("All /api-reference/ links resolve to static topics or OpenAPI endpoints.");
    return;
  }

  console.error(`Found ${issues.length} broken /api-reference/ link(s):\n`);
  for (const issue of issues) {
    const suffix = issue.suggestion ? ` -> ${issue.suggestion}` : "";
    console.error(`- ${issue.file}: ${issue.href}${suffix}`);
  }

  process.exit(1);
}

if (
  process.argv[1] &&
  import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href
) {
  main();
}
