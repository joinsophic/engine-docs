---
name: writing-docs
description: How to write documentation for this project. Use when creating or editing .mdx pages. Covers voice, tone, structure, Mintlify components, and verifying behavior against the backend.
---

# Writing Documentation

You write for engineers integrating with our API. Follow this skill together with
`AGENTS.md` (voice) and `lint-docs-tone` (review pass).

## Voice (non-negotiable)

- Use **"we"** for the API or platform ("we send a POST request", "we'll retry").
- Use **"you"** for the reader ("your endpoint should return a 2xx").
- Prefer contractions ("you'll", "we'll", "don't") over expanded forms.
- Never say "Sophic Engine" in prose. Use "we" or "our API". Acceptable only in
  page titles or site metadata.
- No em dashes (—) in prose. Use commas, colons, parentheses, or a separate
  sentence. Em dashes are fine as empty placeholders in table cells.
- Conversational but precise. Write like a knowledgeable colleague, not a legal
  document.
- Helpful, not patronizing. Assume competence. Explain the non-obvious; skip the
  obvious.
- Direct. Lead with what matters, then add context.

### Tone examples

Good: "You'll need to verify the signature before processing the event."
Bad: "It is necessary for the implementor to perform signature verification prior to event processing."

Good: "We recommend offloading heavy processing to a background job."
Bad: "Heavy processing should be offloaded to a background job."

Good: "Your endpoint may receive the same event more than once."
Bad: "Duplicate event delivery is a possibility that must be accounted for."

## Structure

1. **Start with the outcome.** Open each page by telling the reader what they'll
   learn or be able to do.
2. **Lead every section.** The first sentence of a section states what it does
   or what the reader will learn. Don't lead with background.
3. **Use examples liberally.** Every behavioral concept needs a code example or
   concrete illustration. Prefer `<CodeGroup>` via the `multi-language-examples`
   skill (Python, Node.js, Go, Java, C#).
4. **Explain trade-offs and gotchas.** Use `<Note>` for important context and
   `<Warning>` for things that can break an integration.
5. **Cross-link.** Link related guides and API endpoints. OpenAPI endpoint URLs
   use `/api-reference/{tag}/{summary-slug}`. Before finishing, run
   `pnpm audit-links` via `cross-reference-audit` and do not stop until it
   passes.
6. **Keep pages focused.** One topic per page. Split when a page grows long.
7. **Use Mintlify components.** Prefer `<Steps>`, `<CodeGroup>`, `<Note>`,
   `<Warning>`, `<Tip>`, and `<CardGroup>` where they clarify the page.

## Accuracy

When documenting behavior (retries, timeouts, headers, schemas, enums, status
values), verify against the backend with the `check-backend` skill. Don't guess
field names, paths, or numeric values.

When a new endpoint ships, follow `sync-openapi-nav`. Endpoint pages come from
`openapi.json`; don't hand-add `"METHOD /path"` entries to `docs.json`.

## Style references

We model our docs after [Stripe](https://docs.stripe.com/api),
[Persona](https://docs.withpersona.com), and [Column](https://column.com/docs/).
When unsure about structure or tone, consult those.

## Definition of done

Do **not** stop until all of the following are true:

1. Run the `lint-docs-tone` checklist over every page you edited.
2. Run `pnpm audit-links` (see `cross-reference-audit`) and fix until it exits 0.
3. For user-facing API changes, follow `write-changelog` when an entry is
   required (including its version-tagging and link-audit rules).
