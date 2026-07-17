---
name: check-backend
description: Verify documented API behavior against the backend codebase. Use when writing docs, drafting changelog entries, or inspecting a deployed revision range for partner-visible changes.
---

# Check Backend Implementation

When docs or changelog entries make specific claims about API behavior, verify
them against the backend. Prefer the real code over memory or older docs.

## When to Use

- Documenting numbers: retry counts, timeouts, delay intervals, limits.
- Describing headers, status enums, error types, schemas, or auth.
- Drafting a changelog entry for a release or deployment range.
- Updating existing docs that may have drifted from the implementation.
- Investigating whether a backend revision range has partner-visible impact.

## Resolve the backend checkout

1. Prefer `../backend` when the sibling repository exists locally.
2. When the production workflow has checked out the backend, use `.backend`
   (and only that tree for the deployment range).
3. In a cloud agent without a sibling checkout, clone `joinsophic/backend` into
   a temporary directory using the authenticated GitHub integration.
4. When the payload supplies `backend_prev_revision` and
   `backend_current_revision`:
   - Validate both as exactly 8 lowercase hex characters.
   - Resolve them to full commits with `git -C <backend> rev-parse`.
   - Inspect exactly `backend_prev_revision..backend_current_revision`.
   - Do not infer the deployed range from a local branch tip.

## Cheap checks first (revision ranges)

Before deep reading, run:

```bash
git -C <backend> log --oneline <prev>..<curr>
git -C <backend> diff --name-only <prev>..<curr>
```

If the commits and paths cannot affect partner-visible API behavior (infra,
tests, logging, internal refactors only), stop. No changelog entry is needed.

## Where to look

Engine API surface (start here for partner-visible changes):

| Area | Path |
|---|---|
| Routers / HTTP surface | `sophic/apps/engine/routers/` |
| Request/response schemas | `sophic/apps/engine/schemas/` |
| API version timeline | `sophic/apps/engine/versions.py` |
| Engine error codes | `sophic/apps/engine/error_codes.py` |
| Shared versioning machinery | `sophic/common/api/versioning.py` |
| Shared error code types | `sophic/common/api/error_codes.py` |
| Webhook event metadata | `sophic/domain/events/webhook_events.py` |
| Docs metadata endpoint | `sophic/apps/engine/routers/metadata.py`, `sophic/apps/engine/schemas/resources/metadata.py` |

Domain logic (behavior behind the HTTP surface):

| Area | Path |
|---|---|
| Models | `sophic/domain/*/models/` |
| Actions / services | `sophic/domain/*/actions.py` |
| Workflows | `sophic/domain/*/workflows.py` |
| Constants | `MAX_`, `RETRY_`, `TIMEOUT_` prefixes |

## What counts as partner-visible

Inspect further only when the diff can affect something partners observe:

- Endpoints, fields, enum values, webhook events, or error codes added/removed/changed
- Auth, validation, defaults, pagination, sorting, rounding, idempotency, retries
- Side effects or response semantics
- Deprecations or observable bug fixes
- A changed API version in `versions.py` / `TIMELINE`

Ignore for changelog and most docs claims:

- Internal refactors, infrastructure, CI, tests
- Logging, metrics, performance with no observable behavior change
- Documentation-only or generated-file churn in the backend

## What to verify

- Retry schedules: attempts, backoff, delays, max wait
- Timeouts: connect, read, write, total
- Headers: exact names, formats, when present or omitted
- Status enums, error codes, resource states
- Signature / auth computation
- Request/response field names, types, required vs optional
- OpenAPI and `/.meta/docs` agreement when syncing generated artifacts

## Instructions

1. Resolve the backend checkout and revision range (if any) as above.
2. Run the cheap log/diff checks for ranges.
3. Search the relevant routers, schemas, versions, and domain code.
4. Cross-reference documented values with the code.
5. If docs disagree with the code, update the docs to match the implementation.
6. If something is ambiguous, ask rather than guess.

Never invent field names, paths, status values, or version strings.
