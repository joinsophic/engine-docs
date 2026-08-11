---
name: write-changelog
description: Write and maintain the API changelog in changelog.mdx. Use when shipping a new API version, adding endpoints or fields, changing behavior, deprecating features, or when the production docs agent inspects a deployment range.
---

# Write Changelog

Record user-facing API changes in `changelog.mdx` so integrators can see what
changed and when. A good entry answers three questions fast: *what changed*,
*when*, and *do I need to do anything?*

The changelog is the full partner-visible history. Dated API version entries are
only the subset of that history where the backend shipped a new version (breaking
changes). Everything else is additions, deprecations, or fixes on the current
version.

Model tone and structure after [Stripe's API changelog](https://docs.stripe.com/changelog)
and [Mercury's changelog](https://mercury.com/api/changelog).

Follow `AGENTS.md` voice rules and run `lint-docs-tone` over every entry you
write. Verify facts with `check-backend`.

## When to write an entry

Write an entry only for material changes partners can observe:

- New dated API version (only when the backend actually shipped one; see below)
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

## Version tagging (authoritative signals only)

You do **not** decide whether a change is breaking. The backend does, by shipping
a new dated API version. The changelog's dated entries are that version log; they
are a subset of all partner-visible changes.

### Confirm whether a new API version shipped

A new dated API version exists **only** when at least one of these is true:

1. `metadata/docs.json` `api_version` (or production OpenAPI) is newer than
   "Current version" in [`api-reference/versioning.mdx`](../../../api-reference/versioning.mdx)
2. `sophic/apps/engine/versions.py` `TIMELINE` gained a version in the inspected
   range
3. The user explicitly names a dated version that already exists in `TIMELINE`

Read the current version from `versioning.mdx` / `metadata/docs.json` before
writing. If you can't confirm it, stop and ask. **Never guess a version string.**

### Never invent a version

Do **not** invent a `YYYY-MM-DD` `description` because a change *looks* breaking
under the lists in `versioning.mdx`. Those lists explain platform policy; they
are not a checklist for you to promote an additions entry into a new version.

If the change would be breaking under that policy but `TIMELINE` / `api_version`
did not change, escalate: do not invent a version, and do not mark the entry as
**Breaking**. Prefer no versioned entry over a fabricated one.

### Choose `description`

| Situation | `description` value | Example |
|---|---|---|
| New dated API version confirmed above | the version date from TIMELINE / metadata | `description="2026-04-01"` |
| No version bump; material partner-visible change | `additions` | `description="additions"` |
| Deprecation or sunset notice only | `deprecations` | `description="deprecations"` |

When a new version exists, the newest entry's `description` must be that version.
When it does not, use `additions` or `deprecations` for every material change in
the release, including removals or behavior changes that shipped without a bump.

New version entry shape (only when a version was confirmed):

```mdx
<Update label="April 1, 2026" description="2026-04-01">
  ## Short, benefit-first headline

  <Info>New API version `2026-04-01`. See [Versioning](/api-reference/versioning) to migrate.</Info>

  **Breaking**
  - `POST /accounts/{id}/orders` now requires a `time_in_force` field. Requests on `2026-04-01` and later must include it.
</Update>
```

Describe migration from the version release itself (TIMELINE notes and the diffs
that shipped with that version bump). Do not re-classify unrelated additions in
the same deploy as breaking.

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

  **Changed**
  - `GET /instruments` now returns an `exchange` field on each instrument.

  **Fixed**
  - Corrected rounding on `valuation.total` for accounts held in minor currencies.
</Update>
```

### Categories

Group bullets under bold labels, in this order (omit empty ones):

1. **Breaking**: only when `description` is a confirmed dated API version. Lead
   with these and link to [Versioning](/api-reference/versioning). Never use
   this section on `additions` or `deprecations` entries.
2. **Added**: new endpoints, fields, enum values, event types, error codes.
3. **Changed**: behavior or response changes on the current version.
4. **Deprecated**: still works, scheduled for removal. State the sunset date.
5. **Fixed**: bug fixes with observable impact.

## Instructions

1. Confirm whether a new API version shipped using the authoritative signals
   above. Do not classify changes as breaking yourself.
2. Confirm facts with `check-backend`. Don't guess paths or field names.
3. Choose the `description` tag from the table (dated version, `additions`, or
   `deprecations`).
4. Add a new `<Update>` at the top of `changelog.mdx`, directly under the
   frontmatter, or append bullets to an existing entry for the **same release
   date**. **Never delete, shorten, or rewrite** existing entries or bullets.
5. Write benefit-first prose in `AGENTS.md` voice. Apply `lint-docs-tone`.
6. Cross-link new endpoints/fields. Derive each URL from `openapi.json`:
   `/api-reference/{tag}/{summary-slug}` where `tag` is the operation's first
   OpenAPI tag and `summary-slug` is the slugified `summary` field (lowercase,
   non-alphanumerics to `-`). Never invent slugs from the HTTP path (e.g.
   `/me/permissions` is not `me-permissions`; use the summary, such as
   `list-current-actor-permissions`). Never guess tag names (`auth`, not
   `authentication`).
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
- **Be honest about action required.** On a confirmed new version, say what to
  migrate and link Versioning. On additions, don't claim a version bump.
- **Past tense, active voice.** "We added", "we fixed", "we now return".
- **No em dashes in prose.**
- **Append-only history.** Never delete or rewrite published entries.

## Definition of done

Do **not** stop until all of the following are true:

- Version tag chosen only from authoritative signals (no invented dates)
- Entry only covers partner-visible changes (or you correctly chose no entry)
- New `<Update>` is at the top, or same-day bullets were appended
- `label` is a human date; `description` is `YYYY-MM-DD`, `additions`, or
  `deprecations`
- **Breaking** appears only on a confirmed dated-version entry
- New version also reflected in `versioning.mdx` when this task allows it
- Facts verified against the backend
- Tone matches `AGENTS.md` (we/you, contractions, no em dashes)
- No existing entries or bullets deleted or rewritten
- `rss: true` still present; `changelog` still in `docs.json` navigation
- `pnpm audit-links` exits 0 (see `cross-reference-audit`). If it fails, fix
  every broken link you introduced or touched, then re-run until it passes.
  Do not commit or hand off with a failing audit.
