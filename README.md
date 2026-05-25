# Sophic Engine Documentation

Source for the Sophic Engine API documentation, built with [Mintlify](https://mintlify.com).

## Local development

Install the [Mintlify CLI](https://www.npmjs.com/package/mint):

```bash
npm i -g mint
```

Run the dev server from the root of this repo (where `docs.json` lives):

```bash
mint dev
```

Preview at `http://localhost:3000`. Changes to `.mdx` files and `docs.json` are reflected automatically.

### Troubleshooting

- **Dev server won't start:** Run `mint update` to get the latest CLI version.
- **Page shows 404:** Make sure the page is listed in `docs.json` and the file path matches.

## Project structure

```
docs.json                       # Site config, navigation, OpenAPI spec
docs/                           # Guides and how-to content ("Documentation" tab)
  introduction.mdx
  webhooks/
    ...
  ...
api-reference/                  # API reference topics ("API Reference" tab)
  auth.mdx
  errors.mdx
  versioning.mdx
  ...
changelog.mdx                  # Changelog ("Changelog" tab)
```

## Adding pages and endpoints

### Adding a new documentation page

1. Create a new `.mdx` file in the appropriate directory (e.g. `docs/webhooks/quickstart.mdx`).
2. Add frontmatter with at least a `title`:
   ```yaml
   ---
   title: Quickstart
   description: "Get up and running with webhooks in minutes"
   ---
   ```
3. Add the page path to `docs.json` under the relevant group in the `Documentation` tab:
   ```json
   {
     "group": "Webhooks",
     "pages": [
       "docs/webhooks/overview",
       "docs/webhooks/quickstart"
     ]
   }
   ```

### Adding a new API endpoint

API endpoint pages are auto-generated from the OpenAPI spec. To add one to the sidebar:

1. Make sure the endpoint exists in the OpenAPI spec (`api.openapi` in `docs.json`).
2. Add the endpoint to the relevant group in the `API Reference` tab using the format `"METHOD /path"`:
   ```json
   {
     "group": "Webhooks",
     "pages": [
       "POST /webhooks",
       "GET /webhooks/{webhook_id}"
     ]
   }
   ```

### Adding a new topic page alongside endpoints

You can mix static `.mdx` pages with auto-generated endpoint pages in the same group:

```json
{
  "group": "Topics",
  "pages": [
    "api-reference/auth",
    "api-reference/errors",
    "POST /auth/token"
  ]
}
```

### Adding a new sidebar group

Add a new object to the `groups` array inside the relevant tab:

```json
{
  "group": "New Section",
  "pages": [
    "docs/new-section/overview"
  ]
}
```

## Writing documentation

### Tone of voice

Write as if you're a knowledgeable colleague explaining something to a fellow developer. The tone should be:

- **Conversational but precise.** Use "we" to refer to the API and "you" to address the reader. Avoid stiff, formal phrasing; prefer "you'll need to" over "it is necessary to".
- **Helpful, not patronizing.** Assume the reader is a competent developer. Don't over-explain obvious things, but do explain the non-obvious: the *why*, not just the *what*.
- **No em dashes in prose.** Avoid em dashes (—) in sentences. Use commas, colons, parentheses, or a separate sentence instead. Em dashes are fine as empty placeholders in table cells.
- **Direct.** Get to the point. Lead with what the reader needs to know, then provide context. Put examples close to the concepts they illustrate.

### Content guidelines

- **Start with the outcome.** Open each page by explaining what the reader will learn or be able to do.
- **Use examples liberally.** Every concept should have a code example or a concrete illustration. Provide examples in multiple languages where possible using `<CodeGroup>`.
- **Explain trade-offs and gotchas.** Don't just document the happy path. If something can go wrong (e.g. JSON re-serialization breaking HMAC checks), call it out with a `<Note>` or `<Warning>`.
- **Link to related pages.** Cross-reference other pages in the docs and API reference so readers can easily navigate.
- **Keep pages focused.** Each page should cover one topic well. If a page is getting long, consider splitting it.

### References

We model our documentation after [Stripe's API docs](https://docs.stripe.com/api) and [Persona's developer docs](https://docs.withpersona.com). Both are excellent examples of clear, thorough, developer-friendly documentation.

## Deployment

Pushing to the default branch automatically deploys via the [Mintlify GitHub app](https://dashboard.mintlify.com/settings/organization/github-app).
