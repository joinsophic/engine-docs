---
name: write-changelog
description: Write and maintain the API changelog in changelog.mdx. Use when shipping a new API version, adding endpoints or fields, changing behavior, deprecating features, or when the user asks to record a change. Modeled after Mercury and Stripe changelogs.
---

# Write Changelog

Record user-facing API changes in `changelog.mdx` so integrators can see what changed and whether it affects them. A good changelog answers three questions fast: *what changed*, *when*, and *do I need to do anything?*

Model the tone and structure after [Stripe's API changelog](https://docs.stripe.com/changelog) (rigorous about breaking vs. backwards-compatible) and [Mercury's changelog](https://mercury.com/api/changelog) (readable, human, benefit-first prose).

## When to Use

- A new dated API version is released (e.g. `2026-04-01`).
- An endpoint, field, enum value, event type, or error code is added.
- Behavior changes (pagination, sorting, rounding, rate limits, retry schedule, defaults).
- A feature, field, or version is deprecated or sunset.
- The user asks to "add a changelog entry", "document this release", or "note this change".

Don't log purely internal changes that a developer integrating with the API can't observe (infra, refactors, doc typo fixes).

## Detect the API version first

Before writing any entry, determine whether the change ships as a **new dated API version** or as a **backwards-compatible addition** to the current version. This decision drives how you tag the entry.

1. **Read the current version.** Open [`api-reference/versioning.mdx`](../../../api-reference/versioning.mdx) and note the value under "Current version" (e.g. `2026-01-01`). This is the latest released version.
2. **Compare against the change.** Look for signals that a new version was cut:
   - The user explicitly names a new dated version (e.g. "ship this as `2026-04-01`").
   - The OpenAPI spec (`api.openapi` in `docs.json`) advertises a newer version, or the backend defines a new version constant (search `../backend` for `API_VERSION`, `Api-Version`, or dated version strings; use the `check-backend` skill).
   - The change itself is breaking per the lists in `versioning.mdx`, which *forces* a new version.
3. **Pick the tag** (see below) based on that determination. When a new version exists, the newest entry's `description` must be that version.

If you can't confirm the current version, stop and ask rather than guessing a version string.

## Version tagging convention

The `<Update description>` field is the entry's version tag. Use exactly one of:

| Situation | `description` value | Example |
|---|---|---|
| New dated API version released | the version date | `description="2026-04-01"` |
| Backwards-compatible change, no version bump | `additions` | `description="additions"` |
| Deprecation or sunset notice only | `deprecations` | `description="deprecations"` |

When an entry ships alongside a new version, add a version badge in the body so it's scannable, and always link to Versioning:

```mdx
<Update label="April 1, 2026" description="2026-04-01">
  ## Short, benefit-first headline

  <Info>New API version `2026-04-01`. See [Versioning](/api-reference/versioning) to migrate.</Info>

  **Breaking**
  - `POST /accounts/{id}/orders` now requires a `time_in_force` field. Requests on `2026-04-01` and later must include it.
</Update>
```

## Format

Each entry is a Mintlify `<Update>` component, newest first. Use `label` for the date and `description` for the version tag chosen above.

```mdx
<Update label="April 1, 2026" description="additions">
  ## Short, benefit-first headline

  One or two sentences of plain-language context: what changed and why a
  reader should care. Write like a colleague, not a release bot.

  **Added**
  - New `GET /accounts/{id}/statements` endpoint for retrieving monthly statements. See [Statements](/api-reference/...).

  **Changed** (backwards compatible)
  - `GET /instruments` now returns an `exchange` field on each instrument.

  **Fixed**
  - Corrected rounding on `valuation.total` for accounts held in minor currencies.
</Update>
```

### Categories

Group bullets under bold labels, in this order (omit empty ones):

1. **Breaking** — only in a new API version. Lead with these and link to [Versioning](/api-reference/versioning).
2. **Added** — new endpoints, fields, enum values, event types, error codes.
3. **Changed** — behavior or response changes. Mark each as backwards compatible or breaking.
4. **Deprecated** — still works, but scheduled for removal. State the sunset date.
5. **Fixed** — bug fixes with observable impact.

### Breaking vs. backwards compatible

This is the most important distinction. Classify every change using [`api-reference/versioning.mdx`](../../../api-reference/versioning.mdx) as the source of truth:

- **Backwards-compatible** changes (new resources, new optional params, new response fields, new enum values, new error codes) ship to all versions. Log them under **Added**/**Changed** without a version bump, and tag the entry `description="additions"`.
- **Breaking** changes (removing/renaming params or fields, new required params, type changes, changed semantics) require a **new dated API version**. Log them under **Breaking** in an entry whose `description` is that version date, add the version badge, and call out the migration path.

When unsure whether a change is breaking, check the "Backwards compatible changes" and "Breaking changes" lists in `versioning.mdx` before writing.

## Instructions

1. **Detect the API version** (see "Detect the API version first"). Read the current version from `versioning.mdx` and determine whether this change is a new dated version or a backwards-compatible addition.
2. **Confirm the facts.** If the entry makes specific claims about behavior (new fields, changed values, endpoints), verify them against the backend using the `check-backend` skill. Don't guess field names or endpoint paths.
3. **Classify the change** as breaking or backwards compatible per `versioning.mdx`, then **choose the `description` tag** from the version tagging table.
4. **Add a new `<Update>` at the top** of `changelog.mdx`, directly under the frontmatter, so entries stay reverse-chronological.
5. **Write benefit-first prose**, then categorized bullets. Follow the project tone rules (use "we"/"you", contractions, no em dashes, no "Sophic Engine" in prose). Run the `lint-docs-tone` skill mentality over the entry.
6. **Cross-link** to the relevant API reference or docs page for anything new (use the `cross-reference-audit` skill to confirm links resolve).
7. **Keep `rss: true`** in the frontmatter so the entry publishes to the RSS feed. Don't remove it.
8. **If a new version was released**, also add the version badge to the entry and update the "Current version" in `api-reference/versioning.mdx` and the `Api-Version` header examples so the docs and changelog agree.

## Style rules

- **One entry per release/date**, not one per change. Batch same-day changes together.
- **Lead with the reader's benefit**, not the implementation detail. "You can now retrieve monthly statements" beats "Added statements endpoint".
- **Link, don't re-document.** The changelog points to the reference; it isn't the reference.
- **Be honest about breakage.** If action is required, say so plainly and link the migration path.
- **Past tense, active voice.** "We added", "we fixed", "we now return".
- **No em dashes in prose.** Use commas, colons, parentheses, or a separate sentence.

## Checklist

Before finishing:
- Checked the current version in `versioning.mdx` and determined new-version vs. additions.
- New `<Update>` is at the top, reverse-chronological.
- `label` is a human date; `description` is a valid version tag (`YYYY-MM-DD`, `additions`, or `deprecations`).
- Every change is classified breaking vs. backwards compatible.
- Breaking changes tag `description` with the new version date, include the version badge, and link to Versioning.
- If a new version shipped, `versioning.mdx` "Current version" and `Api-Version` examples were updated to match.
- New endpoints/fields are cross-linked and verified against the backend.
- Tone matches the writing rules (we/you, contractions, no em dashes).
- `rss: true` still present in frontmatter.
- `changelog` page is present in `docs.json` navigation.
