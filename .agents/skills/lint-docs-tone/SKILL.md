---
name: lint-docs-tone
description: Review an .mdx documentation page for tone, style, and structural issues. Use after writing or editing docs to catch violations of our writing guidelines.
---

# Lint Documentation Tone

Review a documentation page for tone, voice, and structural issues based on our writing guidelines.

## When to Use

- After writing or making substantial edits to an `.mdx` file.
- When the user asks you to review or improve existing docs.
- Before considering a documentation page done.

## Instructions

Read through the page and check for the following issues. Fix any you find.

### Voice violations

- **"Sophic Engine" in body text.** Replace with "we" or "our API". Only acceptable in page titles or site metadata.
- **Passive voice where active is clearer.** Prefer "we retry the delivery" over "the delivery is retried".
- **Overly formal phrasing.** Replace "it is necessary to" → "you'll need to", "one should" → "you should", "the implementor" → "you".
- **Missing contractions.** Use "we'll", "won't", "don't", "you'll", not "we will", "will not", "do not", "you will".
- **Em dashes in prose.** Avoid em dashes (—) in sentences. Replace with commas, colons, parentheses, or a separate sentence. Em dashes are fine as empty placeholders in table cells.

### Structural issues

- **Missing examples.** Every behavioral concept should have a code example or concrete illustration.
- **Missing cross-links.** If a page mentions a concept covered elsewhere, it should link to that page.
- **Wall of text.** Break up long paragraphs with tables, lists, steps, or code blocks.
- **Burying the lede.** The first sentence of each section should state what it does or what the reader will learn. Don't lead with background.

### Tone issues

- **Commanding without context.** "Do not rely on delivery order" → "delivery order may not match creation order due to retries and network latency."
- **Patronizing explanations.** Don't explain what HTTP status codes or JSON are.
- **Missing "why".** If telling the reader to do something (e.g. use constant-time comparison), briefly explain why (e.g. to prevent timing attacks).

## Checklist

Verify before finishing:
- No "Sophic Engine" in body text
- Consistent "we"/"you" voice throughout
- Every section has a clear opening sentence
- Code examples present where applicable
- Related pages are cross-linked
- `<Note>` and `<Warning>` used for gotchas
- No unnecessary jargon or over-explanation
- No em dashes (—) in prose (table cell placeholders are OK)
