---
description: How to write good documentation for this project. Reference the Writing Documentation section of the README for full guidelines.
globs: "**/*.mdx"
alwaysApply: false
---

# Writing Documentation

When writing or editing documentation pages, follow the guidelines in the "Writing
documentation" section of the project README.md.

## Key rules

1. **Start with the outcome.** Open each page by telling the reader what they'll learn or be able to do.
2. **Use examples liberally.** Every concept should have a code example. Use `<CodeGroup>` for multi-language examples (Python, Node.js, Go, Java, C#).
3. **Explain trade-offs and gotchas.** Use `<Note>` for important context and `<Warning>` for things that can break an integration.
4. **Cross-link.** Reference related documentation pages and API endpoints so readers can navigate easily.
5. **Keep pages focused.** One topic per page. If it's getting long, split it.
6. **Use Mintlify components.** Prefer `<Steps>`, `<CodeGroup>`, `<Note>`, `<Warning>`, `<Tip>`, and `<CardGroup>` where appropriate.
7. **Reference the real implementation.** When documenting behavior (retry schedules, timeouts, headers), check the backend codebase at `../sophic-backend` to ensure accuracy.
8. **No em dashes in prose.** Avoid em dashes (—) in sentences. Use commas, colons, parentheses, or a separate sentence instead. Em dashes are fine as empty placeholders in table cells.

## Style reference

We model our docs after [Stripe](https://docs.stripe.com/api), [Persona](https://docs.withpersona.com), and [Column](https://column.com/docs/).
When unsure about structure or tone, consult those as examples.
