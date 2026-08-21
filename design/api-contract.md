# API Contract — Todo List App

Backend: **json-server**, exposing a REST API over a single `tasks` resource, backed by `db.json`. Routes below are json-server's standard conventions for a resource named `tasks`.

Base URL (local dev): `http://localhost:3000`

---

## Resource: `Task`

```json
{
  "id": 1,
  "title": "Buy milk",
  "completed": false
}
```

| Field | Type | Notes |
|---|---|---|
| `id` | number | Auto-assigned by json-server on creation. Not client-supplied. |
| `title` | string | The task description. Required, non-empty (enforced client-side per US-1 AC3). Recommended max 200 chars (per NFR §2). |
| `completed` | boolean | Defaults to `false` on creation. Toggled via PATCH. |

---

## Endpoints

### `GET /tasks`
Fetch all tasks. Used on app load (US-2).

**Response 200:**
```json
[
  { "id": 1, "title": "Buy milk", "completed": false },
  { "id": 2, "title": "Walk the dog", "completed": true }
]
```
Empty list returns `[]` (drives the empty-state UI per US-2 AC3).

---

### `POST /tasks`
Create a new task (US-1).

**Request body:**
```json
{ "title": "Buy milk", "completed": false }
```

**Response 201:**
```json
{ "id": 3, "title": "Buy milk", "completed": false }
```

**Client-side validation before sending:** `title` must be non-empty after trimming whitespace (US-1 AC3). The API itself does not enforce this — json-server does not validate payloads.

---

### `PATCH /tasks/:id`
Update a task's completed status (US-3). Also usable for future edit features (out of scope for now, per `user-stories.md`).

**Request body:**
```json
{ "completed": true }
```

**Response 200:**
```json
{ "id": 1, "title": "Buy milk", "completed": true }
```

**Response 404:** if `:id` does not exist (e.g., task was already deleted in another tab — see NFR §7, concurrent tabs).

---

### `DELETE /tasks/:id`
Delete a task (US-4).

**Response 200:**
```json
{}
```

**Response 404:** if `:id` does not exist (already deleted).

---

## Error Handling Contract (per NFR §1)

json-server returns standard HTTP status codes; the frontend is responsible for interpreting them:

| Status | Meaning | Frontend behavior |
|---|---|---|
| 200 / 201 | Success | Update local state, re-render |
| 404 | Task not found (stale local state) | Remove from local state, show inline notice, re-render |
| 0 / network error | Backend unreachable | Show error banner, do not apply optimistic change (or roll it back) |

No 4xx validation errors are expected from json-server itself (it doesn't validate schema) — all input validation (non-empty title, length limits) happens client-side before the request is sent.

---

## Explicitly Out of Scope for this Contract
- No authentication headers or tokens (no-auth constraint).
- No pagination or query params for filtering — filtering is client-side only (US-5), so the API always returns the full list.
- No PUT (full replace) — PATCH is sufficient for the one supported update (toggling `completed`).
