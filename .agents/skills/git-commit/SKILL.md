---
name: git-commit
description: Conventions for validating, staging, and committing changes in the documentation repository. Use before running git commit.
---

# Writing documentation commits

This skill is adapted from the sibling backend repository's `git-commit` skill.

## Instructions

1. Run `pnpm build` before committing documentation or configuration changes.
2. For prose edits, run the `lint-docs-tone` checklist. For API behavior claims,
   confirm facts with `check-backend`. For partner-visible API changes, follow
   `write-changelog` when an entry is required.
3. Review the complete diff and confirm generated files agree with their sources:
   - `openapi.json` comes from production `/openapi.json` (via
     `scripts/sync-metadata.mjs`).
   - `metadata/docs.json` comes from production `/.meta/docs`.
   - `snippets/autogen/error-codes.jsx` and
     `snippets/autogen/webhook-events.jsx` are generated from `metadata/docs.json`.
4. Check that the diff contains no credentials, webhook URLs, access tokens, or environment files.
5. Stage only files related to the requested documentation update.
6. Use a concise imperative commit message with the `[docs]` prefix:

```bash
git commit -m "[docs] Document production API changes"
```

Never bypass hooks, amend another author's commit, or commit unrelated working-tree changes.
