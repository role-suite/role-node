# User Quickstart

This guide is a short onboarding path for first-time users.

For complete endpoint and payload reference, use `docs/guides/user-reference-manual.md`.

This quickstart uses REST examples (`curl`).

## 1) Start the backend

```bash
pnpm install
cp .env.example .env
pnpm db:migrate
pnpm dev
```

Check liveness:

```bash
curl -s http://localhost:3000/health
```

## 2) Register and capture auth values

```bash
curl -s -X POST http://localhost:3000/api/auth/register \
  -H 'Content-Type: application/json' \
  -d '{
    "name": "Alice Example",
    "email": "alice@example.com",
    "password": "password123",
    "accountType": "single"
  }'
```

Save:

- `data.tokens.accessToken`
- `data.tokens.refreshToken`
- `data.workspace.id`

## 3) Create a collection

```bash
ACCESS_TOKEN="<access-token>"
WORKSPACE_ID="<workspace-id>"

curl -s -X POST "http://localhost:3000/api/workspaces/${WORKSPACE_ID}/collections" \
  -H "Authorization: Bearer ${ACCESS_TOKEN}" \
  -H 'Content-Type: application/json' \
  -d '{"name":"Orders API","description":"Orders endpoints"}'
```

## 4) Add an endpoint to the collection

```bash
COLLECTION_ID="<collection-id>"

curl -s -X POST "http://localhost:3000/api/workspaces/${WORKSPACE_ID}/collections/${COLLECTION_ID}/endpoints" \
  -H "Authorization: Bearer ${ACCESS_TOKEN}" \
  -H 'Content-Type: application/json' \
  -d '{
    "name":"Get Orders",
    "method":"GET",
    "url":"https://api.example.com/orders",
    "queryParams":[{"key":"limit","value":"10"}],
    "auth":{"type":"none"}
  }'
```

## 5) Create environment and variables

Create environment:

```bash
curl -s -X POST "http://localhost:3000/api/workspaces/${WORKSPACE_ID}/environments" \
  -H "Authorization: Bearer ${ACCESS_TOKEN}" \
  -H 'Content-Type: application/json' \
  -d '{"name":"Dev"}'
```

Then add variables using:

- `POST /api/workspaces/:workspaceId/environments/:environmentId/variables`

## 6) Optional organization features

- Folders:
  - `GET/POST/PATCH/DELETE /api/workspaces/:workspaceId/collections/:collectionId/folders`
- Endpoint examples:
  - `GET/POST/PATCH/DELETE /api/workspaces/:workspaceId/collections/:collectionId/endpoints/:endpointId/examples`

## 7) Body modes quick reference

Endpoint bodies (saved on collection endpoints) support:

- `raw`
- `urlencoded`
- `formdata`
- `binary`
- `none`

## 8) Common error map

- `401`: missing or invalid token
- `403`: no access or insufficient role
- `404`: resource not found in workspace scope

## 9) Next docs

- Full API reference: `docs/guides/user-reference-manual.md`
- Developer guide: `docs/guides/developer-manual.md`
- Implementation playbook: `docs/guides/implementation-manual.md`
