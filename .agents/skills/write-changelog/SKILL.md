---
name: write-changelog
description: Write and maintain the API changelog in changelog.mdx. Use when shipping a new API version, adding endpoints or fields, changing behavior, deprecating features, or when the production docs agent inspects a deployment range.
---

# Write Changelog

Record user-facing API changes in `changelog.mdx` so integrators can see what
changed and whether it affects them. A good entry answers three questions fast:
*what changed*, *when*, and *do I need to do anything?*

Model tone and structure after [Stripe's API changelog](https://docs.stripe.com/changelog)
(rigorous about breaking vs backwards-compatible) and
[Mercury's changelog](https://mercury.com/api/changelog) (readable, benefit-first).

Follow `AGENTS.md` voice rules and run `lint-docs-tone` over every entry you
write. Verify facts with `check-backend`.

## When to write an entry

Write an entry only for material changes partners can observe:

- New dated API version (e.g. `2026-04-01`)
- Endpoint, field, enum value, webhook event, or error code added/removed/changed
- Observable behavior changes (pagination, sorting, rounding, rate limits, retry
  schedule, defaults, validation, auth, idempotency, side effects)
- Deprecation or sunset
- Observable bug fix

## When not to write an entry

Do **not** log:

- Internal refactors, infrastructure, CI, tests, logging
- Performance changes with no observable behavior change
- Documentation-only edits or typo fixes
- Generated-file churn by itself (formatting, key ordering, OpenAPI descriptions,
  examples, server metadata, or `openapi_sha256` alone)
- Cosmetic OpenAPI diffs with no semantic change

If you're unsure, inspect the backend with `check-backend`. When the evidence is
still thin, prefer no entry over a speculative one.

## Investigation paths (production automation)

The production workflow may pass `generated_changed`. Use it to choose a path:

### Path A (`generated_changed` is true)

Production OpenAPI or metadata differs from what is committed. Compare this
branch against `origin/main` for `openapi.json` and `metadata/docs.json`. Inspect
only semantic differences:

- Added, removed, or changed operations
- Request/response fields, required fields, types, enums, status codes, security
- Webhook events or error codes
- A changed `api_version`

Ignore formatting, key ordering, descriptions, examples, server metadata, and
`openapi_sha256` alone. If the diff is cosmetic only, stop: no changelog edit,
no commit.

### Path B (`generated_changed` is false)

Synced artifacts match the committed ones, so OpenAPI alone cannot explain the
run (typically `force_docs_update`). Inspect the backend deployment range with
`check-backend` (cheap log/diff first, then targeted reads). If nothing
partner-visible changed, stop.

### Deduping

Before editing, check whether `changelog.mdx` already documents the same change.
If it does, stop without making changes.

## Detect the API version first

Before writing, decide whether this ships as a **new dated API version** or a
**backwards-compatible addition** to the current version.

1. Read the current version under "Current version" in
   [`api-reference/versioning.mdx`](../../../api-reference/versioning.mdx).
2. Look for a new version signal:
   - User names a new dated version
   - Backend `sophic/apps/engine/versions.py` `TIMELINE` gained a version
   - OpenAPI / metadata advertises a newer `api_version`
   - The change is breaking per `versioning.mdx` (forces a new version)
3. Choose the `description` tag from the table below. When a new version exists,
   the newest entry's `description` must be that version.

If you can't confirm the current version, stop and ask. Never guess a version
string.

## Version tagging

The `<Update description>` field is the version tag. Use exactly one of:

| Situation | `description` value | Example |
|---|---|---|
| New dated API version released | the version date | `description="2026-04-01"` |
| Backwards-compatible change, no version bump | `additions` | `description="additions"` |
| Deprecation or sunset notice only | `deprecations` | `description="deprecations"` |

New version entry shape:

```mdx
<Update label="April 1, 2026" description="2026-04-01">
  ## Short, benefit-first headline

  <Info>New API version `2026-04-01`. See [Versioning](/api-reference/versioning) to migrate.</Info>

  **Breaking**
  - `POST /accounts/{id}/orders` now requires a `time_in_force` field. Requests on `2026-04-01` and later must include it.
</Update>
```

## Format

Each entry is a Mintlify `<Update>`, newest first. `label` is the human date;
`description` is the version tag.

```mdx
<Update label="April 1, 2026" description="additions">
  ## Short, benefit-first headline

  One or two sentences of plain-language context: what changed and why a
  reader should care. Write like a colleague, not a release bot.

  **Added**
  - New `GET /accounts/{id}/statements` endpoint for retrieving monthly statements. See [Create an account statement](/api-reference/accounts/create-an-account-statement).

  **Changed** (backwards compatible)
  - `GET /instruments` now returns an `exchange` field on each instrument.

  **Fixed**
  - Corrected rounding on `valuation.total` for accounts held in minor currencies.
</Update>
```

### Categories

Group bullets under bold labels, in this order (omit empty ones):

1. **Breaking**: only in a new API version. Lead with these and link to
   [Versioning](/api-reference/versioning).
2. **Added**: new endpoints, fields, enum values, event types, error codes.
3. **Changed**: behavior or response changes. Mark each as backwards compatible
   or breaking.
4. **Deprecated**: still works, scheduled for removal. State the sunset date.
5. **Fixed**: bug fixes with observable impact.

### Breaking vs backwards compatible

Classify every change using `api-reference/versioning.mdx` as the source of
truth:

- **Backwards-compatible** (new resources, optional params, response fields,
  enum values, error codes): ship under **Added**/**Changed**, tag
  `description="additions"`.
- **Breaking** (removing/renaming fields, new required params, type changes,
  changed semantics): require a new dated version, tag `description` with that
  date, add the version badge, and call out the migration path.

When unsure, re-read the "Backwards compatible changes" and "Breaking changes"
lists in `versioning.mdx` before writing.

## Instructions

1. Detect the API version (new dated version vs additions).
2. Confirm facts with `check-backend`. Don't guess paths or field names.
3. Classify breaking vs backwards compatible, then choose the `description` tag.
4. Add a new `<Update>` at the top of `changelog.mdx`, directly under the
   frontmatter, or append bullets to an existing entry for the **same release
   date**. **Never delete, shorten, or rewrite** existing entries or bullets.
5. Write benefit-first prose in `AGENTS.md` voice. Apply `lint-docs-tone`.
6. Cross-link new endpoints/fields. OpenAPI URLs use
   `/api-reference/{tag}/{summary-slug}`. Confirm with `cross-reference-audit`.
7. Keep `rss: true` in the frontmatter.
8. If a new version shipped, update "Current version" in
   `api-reference/versioning.mdx` and `Api-Version` header examples so docs and
   changelog agree. (Changelog-only automation agents: skip this step and only
   edit `changelog.mdx` unless your task explicitly allows other files.)

## Style rules

- **One entry per release/date**, not one per change. Batch same-day changes.
- **Lead with the reader's benefit.** "You can now retrieve monthly statements"
  beats "Added statements endpoint".
- **Link, don't re-document.** The changelog points to the reference.
- **Be honest about breakage.** If action is required, say so and link migration.
- **Past tense, active voice.** "We added", "we fixed", "we now return".
- **No em dashes in prose.**
- **Append-only history.** Never delete or rewrite published entries.

## Checklist

- Current version checked in `versioning.mdx`; new-version vs additions decided
- Entry only covers partner-visible changes (or you correctly chose no entry)
- New `<Update>` is at the top, or same-day bullets were appended
- `label` is a human date; `description` is `YYYY-MM-DD`, `additions`, or
  `deprecations`
- Every change classified breaking vs backwards compatible
- Breaking changes use the version date, include the badge, and link Versioning
- New version also reflected in `versioning.mdx` when this task allows it
- Facts verified against the backend; links verified
- Tone matches `AGENTS.md` (we/you, contractions, no em dashes)
- No existing entries or bullets deleted or rewritten
- `rss: true` still present; `changelog` still in `docs.json` navigation
