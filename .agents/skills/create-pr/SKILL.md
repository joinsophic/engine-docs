---
name: create-pr
description: Conventions for pushing documentation branches and opening pull requests. Use before git push or gh pr create.
---

# Creating documentation pull requests

This skill is adapted from the sibling backend repository's `create-pr` skill.

## Instructions

1. Follow the `git-commit` skill and commit all intended changes.
2. Push the current branch without force:

```bash
git push --set-upstream origin HEAD
```

3. Check whether the branch already has an open pull request. Update that pull request instead of creating a duplicate.
4. If no pull request exists, open one against `main` with a `[docs]` title.
5. Include:
   - The backend `backend_prev_revision..backend_current_revision` range when
     this update came from a production deploy.
   - A concise summary of partner-visible changes (or that none required a
     changelog entry).
   - Whether the API version changed.
   - The generated OpenAPI and metadata verification performed
     (`scripts/sync-metadata.mjs`).
   - The result of `pnpm build`.

Never push directly to `main` or force-push an automation branch.
