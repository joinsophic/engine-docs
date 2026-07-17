---
name: check-backend
description: Verify documented API behavior (retries, timeouts, headers, schemas) against the backend codebase. Use when writing or editing docs that make specific claims about how the API works.
---

# Check Backend Implementation

When writing or editing documentation about specific API behavior, verify the values against the actual backend code to prevent drift between docs and implementation.

## When to Use

- When documenting specific numbers: retry counts, timeout values, delay intervals.
- When describing headers, status enums, error types, or schemas.
- When a user asks you to document a feature and you're unsure of the exact details.
- When updating existing docs, the backend may have changed since the docs were last written.

## Instructions

1. Resolve the backend checkout:
   - Use `../backend` when the sibling repository exists locally.
   - In a cloud agent, clone `joinsophic/backend` into a temporary directory using the
     authenticated GitHub integration.
   - When the automation payload supplies `backend_prev_revision` and
     `backend_current_revision`, validate both as 8-character Git revisions, resolve them
     to full commits in the backend checkout, and inspect exactly
     `backend_prev_revision..backend_current_revision`. Do not infer the deployed range
     from a local branch.
2. Search for the relevant domain logic. Common locations:
   - **Models:** `sophic/domain/*/models/`
   - **Actions/services:** `sophic/domain/*/actions.py`
   - **Workflows:** `sophic/domain/*/workflows.py`
   - **API schemas:** `sophic/apps/engine/schemas/`
   - **API routers:** `sophic/apps/engine/routers/`
   - **Constants:** look for `MAX_`, `RETRY_`, `TIMEOUT_` prefixes
3. Cross-reference the documented values with the code.
4. If they don't match, update the documentation to reflect the implementation.
5. If you find something ambiguous, ask the user before guessing.

## What to Check

- **Retry schedules:** Number of attempts, backoff algorithm, delay values, max wait times.
- **Timeouts:** Connect, read, write, and total timeout values.
- **Headers:** Exact header names, formats, and when they're included or omitted.
- **Status enums:** Delivery statuses, error types, resource states.
- **Signature computation:** Algorithm, signing input format, secret handling.
- **Request/response schemas:** Field names, types, required vs optional.
