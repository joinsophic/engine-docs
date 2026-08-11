---
name: cross-reference-audit
description: Audit internal links across documentation pages to find broken references. Use after reorganizing pages, renaming files, editing changelog entries, or before finishing any docs change that adds or changes links.
---

# Cross-Reference Audit

Check that all internal links in documentation pages point to valid destinations.
Broken `/api-reference/...` links are a release blocker.

## When to Use

- After reorganizing, renaming, or deleting documentation pages.
- After creating new pages and adding links to them.
- After editing `changelog.mdx` or any page that links into the API reference.
- When the user asks you to check for broken links.
- As a required step in the definition of done for docs and changelog work.

## Definition of done

Do **not** finish the task until:

```bash
pnpm audit-links
```

exits 0. If it fails, fix every reported link, then re-run. Repeat until the
command passes. Prefer this automated check over manual grepping when you only
need pass/fail.

## Instructions

1. Run the repo check and treat a non-zero exit as incomplete work:

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

5. **Fix OpenAPI endpoint links.** Links to API endpoint pages use
   `/api-reference/{tag}/{summary-slug}` where `tag` is the operation's first
   OpenAPI tag and `summary-slug` is the slugified `summary` field. Do **not**
   derive the slug from the HTTP path: `/me/permissions` is not
   `me-permissions`. Flat `/api-reference/{summary-slug}` paths 404. When
   `pnpm audit-links` suggests a replacement, use it. Confirm against
   `openapi.json` when unsure.

6. **Check for stale references.** If any files were renamed or moved during this session, search all `.mdx` files for references to the old paths and update them.

## Common Issues

- **Renamed pages without updating references.** Always search for the old path after renaming.
- **Wrong slug for auto-generated API pages.** The slug comes from the OpenAPI `summary` and first `tag`. When unsure, run `pnpm audit-links` rather than guessing.
- **Page exists on disk but missing from docs.json.** The page won't be accessible until it's added to navigation.
- **Changelog links written from memory.** Always verify endpoint hrefs with `pnpm audit-links` before considering the entry done.
