---
name: lint-docs-tone
description: Review an .mdx documentation page for tone, style, and structural issues. Use after writing or editing docs to catch violations of AGENTS.md and the writing-docs skill.
---

# Lint Documentation Tone

Review a documentation page against `AGENTS.md` and the `writing-docs` skill.
Fix every issue you find before considering the page done.

## When to Use

- After writing or making substantial edits to an `.mdx` file.
- When the user asks you to review or improve existing docs.
- Before committing documentation changes.
- After drafting or extending a changelog entry (apply the same voice rules).

## Instructions

Read the page and check the following. Fix violations in place.

### Voice violations

- **"Sophic Engine" in body text.** Replace with "we" or "our API". Only
  acceptable in page titles or site metadata.
- **Wrong person.** Platform actions use "we"; reader actions use "you".
- **Passive voice where active is clearer.** Prefer "we retry the delivery"
  over "the delivery is retried".
- **Overly formal phrasing.** Replace "it is necessary to" → "you'll need to",
  "one should" → "you should", "the implementor" → "you".
- **Missing contractions.** Use "we'll", "won't", "don't", "you'll", not
  "we will", "will not", "do not", "you will" (unless emphasis requires it).
- **Em dashes in prose.** Replace em dashes (—) with commas, colons,
  parentheses, or a separate sentence. Em dashes are fine as empty placeholders
  in table cells.

### Structural issues

- **Missing examples.** Every behavioral concept should have a code example or
  concrete illustration.
- **Missing cross-links.** If a page mentions a concept covered elsewhere, link
  to that page. Confirm destinations with `cross-reference-audit`.
- **Wall of text.** Break up long paragraphs with tables, lists, steps, or code
  blocks.
- **Burying the lede.** The first sentence of each section should state what it
  does or what the reader will learn.

### Tone issues

- **Commanding without context.** "Do not rely on delivery order" → "Delivery
  order may not match creation order due to retries and network latency."
- **Patronizing explanations.** Don't explain what HTTP status codes or JSON are.
- **Missing "why".** If telling the reader to do something (e.g. use
  constant-time comparison), briefly explain why.

## Checklist

- No "Sophic Engine" in body text
- Consistent "we"/"you" voice throughout
- Contractions preferred where natural
- Every section has a clear opening sentence
- Code examples present where applicable
- Related pages are cross-linked
- `<Note>` and `<Warning>` used for gotchas
- No unnecessary jargon or over-explanation
- No em dashes (—) in prose (table cell placeholders are OK)
