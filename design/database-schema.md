# Database Schema — Todo List App

Per the stated constraint (no database server), persistence is a single JSON file, `db.json`, served and mutated by json-server. This document describes its structure as the closest equivalent to a schema.

---

## File: `db.json`

```json
{
  "tasks": [
    {
      "id": 1,
      "title": "Buy milk",
      "completed": false
    },
    {
      "id": 2,
      "title": "Walk the dog",
      "completed": true
    }
  ]
}
```

- The top-level key `tasks` is a json-server convention: it becomes the `/tasks` REST resource (see `api-contract.md`).
- There is a single collection — no separate `users` table, consistent with the no-auth, single-shared-list constraint (US-6 AC3).

---

## Field Definitions

| Field | Type | Constraints | Notes |
|---|---|---|---|
| `id` | integer | Unique, auto-incremented | Assigned by json-server on `POST`; not set by the client. |
| `title` | string | Non-empty (client-enforced); recommended max 200 chars (per NFR §2) | The task description shown in the UI. |
| `completed` | boolean | `true` / `false` | Defaults to `false` when a task is created. |

---

## Design Notes

- **No relationships / no foreign keys.** A single flat collection is sufficient — there's nothing to join against given no users, no categories, no due dates in the current scope.
- **No schema enforcement.** json-server does not validate the shape of records against a schema; data integrity (non-empty title, boolean completed) is enforced entirely client-side, which is why the frontend validation rules in `api-contract.md` matter.
- **No indexing needed.** At the expected scale ("up to a few hundred tasks" per NFR §2), a flat array scan is more than adequate — no performance concern.
- **File-based storage caveat (per NFR §7):** `db.json` is a plain file, not a transactional database. Concurrent writes (e.g., two browser tabs mutating at once) are not guaranteed to be race-free. Acceptable for this single-user, personal-use scope, and explicitly noted as an accepted limitation rather than something to engineer around.

## Future Extension Points (not in current scope)
If the app ever grew beyond current stories, the schema has natural extension points without breaking existing fields:
- `createdAt` / `dueDate` — for sorting or due-date features.
- `priority` — for a priority/tag feature.
- `userId` — only if multi-user support were ever added (explicitly excluded per `user-stories.md`).
