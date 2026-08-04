---
name: cross-reference-audit
description: Audit internal links across documentation pages to find broken references. Use after reorganizing pages, renaming files, or before a release.
---

# Cross-Reference Audit

Check that all internal links in documentation pages point to valid destinations.

## When to Use

- After reorganizing, renaming, or deleting documentation pages.
- After creating new pages and adding links to them.
- When the user asks you to check for broken links.
- As a final review step before committing changes.

## Instructions

1. Prefer the repo's automated check when you only need a pass/fail signal:

```bash
pnpm audit-links
```

2. **Find all internal links.** Search `.mdx` files for markdown link patterns like `](/some/path)` and `](#anchor)`.

3. **Validate static page links.** For links starting with `/docs/` or `/api-reference/`:
   - Check that a corresponding `.mdx` file exists on disk at that path.
   - Check that the page is listed in `docs.json` navigation (a file on disk won't appear in docs unless it's in the nav).

4. **Validate anchor links.** For links containing `#fragment`:
   - Open the target page.
   - Verify a heading exists that would produce that anchor ID (Mintlify generates IDs by lowercasing and hyphenating heading text, e.g. `## Handling Duplicates` becomes `#handling-duplicates`).

5. **Flag auto-generated page links.** Links to API endpoint pages (e.g. `/api-reference/webhooks/create-a-webhook`) depend on how Mintlify generates slugs from the OpenAPI spec. Mintlify uses `/api-reference/{tag}/{summary-slug}` where `tag` is the operation's first OpenAPI tag and `summary-slug` is the slugified `summary` field. Verify against `openapi.json` (or run `pnpm audit-links`). Do **not** derive the slug from the HTTP path: `/me/permissions` is not `me-permissions`. Flat `/api-reference/{summary-slug}` paths 404.

6. **Check for stale references.** If any files were renamed or moved during this session, search all `.mdx` files for references to the old paths and update them.

## Common Issues

- **Renamed pages without updating references.** Always search for the old path after renaming.
- **Wrong slug for auto-generated API pages.** The slug depends on the OpenAPI operationId or method+path. When unsure, note the link for verification.
- **Page exists on disk but missing from docs.json.** The page won't be accessible until it's added to navigation.
