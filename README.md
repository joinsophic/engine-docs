# Sophic Engine Documentation

Source for the Sophic Engine API documentation, built with [Mintlify](https://mintlify.com).

## Local development

Install node if you haven't. The project uses nvm so if you have that installed run:
```bash
nvm install
```

If not then download and install node `v24.16.0`.

Install the [Mintlify CLI](https://www.npmjs.com/package/mint):

```bash
pnpm i
```

Run the dev server from the root of this repo (where `docs.json` lives):

```bash
pnpm run dev
```

Preview at `http://localhost:3000`. Changes to `.mdx` files and `docs.json` are reflected automatically.

### Troubleshooting

- **Dev server won't start:** Run `mint update` to get the latest CLI version.
- **Page shows 404:** Make sure the page is listed in `docs.json` and the file path matches.

## Project structure

```
docs.json                       # Site config and navigation
openapi.json                    # Generated production OpenAPI spec
metadata/docs.json              # Generated production docs metadata
snippets/autogen/               # Error-code and webhook-event data generated from metadata
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

API endpoint pages are auto-generated from `openapi.json`. When the backend ships a new endpoint, sync the spec (see [Automatic docs updates](#automatic-docs-updates)) and the page appears in the API Reference tab automatically. No changes to `docs.json` are needed.

To control sidebar grouping, add `tags` to operations in the backend OpenAPI spec.

### Adding a new topic page alongside endpoints

Static topic pages (auth, errors, versioning, etc.) live in the Topics group. Endpoint pages are generated from the OpenAPI spec in a separate group:

```json
{
  "group": "Topics",
  "pages": [
    "api-reference/auth",
    "api-reference/errors"
  ]
},
{
  "group": "Endpoints",
  "openapi": "openapi.json"
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

### Automatic docs updates

Docs validation runs in the `CI` workflow on pull requests and pushes to
`main`. The `update-docs` workflow only generates documentation updates: it
listens for a `production-deployed` repository dispatch with this payload:

```json
{
  "event_type": "production-deployed",
  "client_payload": {
    "render_deploy_id": "dep-..."
  }
}
```

Set the `ENGINE_API_RENDER_SERVICE_ID` repository variable, plus these
repository secrets, before running the workflow:

| Secret / variable | Purpose |
|---|---|
| `RENDER_API_KEY` | Verify the Render deployment and resolve backend revisions |
| `DOCS_AUTOMATION_TOKEN` | Push the automation branch and open the PR (must be a PAT or GitHub App token so the PR can trigger CI) |
| `ANTHROPIC_API_KEY` | Run the changelog agent |
| `BACKEND_REPO_READ_TOKEN` | Check out `joinsophic/backend` when forced to inspect a no-artifact deploy range |
| `SLACK_BOT_TOKEN` (secret) / `DOCS_SLACK_CHANNEL_ID` (variable) | Optional: notify Slack when the changelog changes |

`SLACK_BOT_TOKEN` must be a Bot User OAuth token (`xoxb-`) with `chat:write`.
App-level tokens (`xapp-`) cannot post messages. A Slack failure will not fail
the job.

The workflow resolves the current and previous backend revisions from Render
deployment history, then syncs production artifacts with
`scripts/sync-metadata.mjs` (which checks that `/.meta/docs` and
`/openapi.json` agree on `openapi_sha256`). If generated artifacts changed (or
the run is forced), it commits them to an `automation/api-docs-*` branch, runs
the changelog agent, and opens a pull request. CI validates that PR.

The workflow skips the branch and changelog agent when `openapi.json`,
`metadata/docs.json`, and the generated snippets are unchanged. To run the
agent for a behavioral change that does not affect those files, set
`client_payload.force_docs_update` to `true` or run the workflow manually with
**Run the docs agent even when generated artifacts are unchanged** selected.
