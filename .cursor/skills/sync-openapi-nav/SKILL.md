---
name: sync-openapi-nav
description: Ensure new API endpoints from the OpenAPI spec are reflected in docs.json navigation. Use when endpoints are added or the user mentions a new API route.
---

# Sync OpenAPI Navigation

Keep the `docs.json` navigation in sync with the OpenAPI specification.

## When to Use

- When a new API endpoint has been added to the OpenAPI spec.
- When the user mentions a new endpoint or asks to document one.
- When reviewing docs.json for completeness.

## Instructions

1. **Read the OpenAPI spec.** The committed file is configured in `docs.json` at
   `api.openapi`. Read it and list all available endpoints.

2. **Compare with docs.json.** Check the `API Reference` tab's groups and pages. Each documented endpoint uses the format `"METHOD /path"`.

3. **Identify missing endpoints.** Any endpoint in the spec that isn't listed in `docs.json` needs to be added.

4. **Add to the correct group.** Place the endpoint in the group that matches its resource using the format `"METHOD /path"`.

5. **Create a new group if needed:**

   ```json
   {
     "group": "New Resource",
     "pages": [
       "POST /new-resource",
       "GET /new-resource/{id}",
       "GET /new-resource"
     ]
   }
   ```

6. **Consider a topic page.** If the new endpoint introduces a new concept, suggest creating a companion `.mdx` page in `documentation/` to explain it.

## Endpoint ordering convention

Within each group, order endpoints as:

1. `POST` (create)
2. `GET /{id}` (retrieve single)
3. `GET /` (list)
4. `PUT` / `PATCH` (update)
5. `DELETE` (delete)
6. Action endpoints (e.g. `POST /.../test`, `POST /.../cancel`)
