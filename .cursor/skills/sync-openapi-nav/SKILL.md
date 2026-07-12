---
name: sync-openapi-nav
description: Verify API Reference navigation is driven by openapi.json. Use when endpoints are added or the user mentions a new API route.
---

# Sync OpenAPI Navigation

The API Reference tab auto-generates endpoint pages from `openapi.json`. You do not need to add individual `"METHOD /path"` entries to `docs.json`.

## When to Use

- When a new API endpoint has been added to the backend.
- When the user mentions a new endpoint or asks to document one.
- When reviewing whether docs navigation is in sync with the API.

## Instructions

1. **Confirm the endpoint is in the OpenAPI spec.** The committed file is configured in `docs.json` at `api.openapi`. Read it and verify the endpoint exists.

2. **Do not add endpoint entries to `docs.json`.** Mintlify generates pages for all endpoints from the spec via the Endpoints group in the API Reference tab:

   ```json
   {
     "group": "Endpoints",
     "openapi": "openapi.json"
   }
   ```

   The `group` field is required. A bare `{ "openapi": "openapi.json" }` entry is ignored and leaves the API Reference tab empty.

3. **Keep topic pages separate.** Static guides like `api-reference/auth.mdx` live in the Topics group. Only add new `.mdx` files there when you need conceptual documentation beyond what the OpenAPI spec provides.

4. **Update cross-references in prose docs.** When a new endpoint ships, add links from relevant guide pages (e.g. `docs/webhooks/overview.mdx`) using Mintlify's auto-generated slug for that endpoint.

5. **Consider OpenAPI tags for grouping.** If endpoints should appear in named sidebar groups, add `tags` to operations in the backend OpenAPI spec rather than hardcoding navigation in `docs.json`.
