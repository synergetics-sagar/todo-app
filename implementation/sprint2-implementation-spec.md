# Sprint 2 Implementation Spec — Todo List App

**Purpose:** Implementation-ready handoff for an AI coding assistant (GitHub Copilot). Covers Sprint 2 only, per `sprint-plan.md`: US-3 (Toggle), US-4 (Delete), US-5 (Filter). Builds directly on the Sprint 1 codebase — see `sprint1-implementation-spec.md`.

**Stack:** Same as Sprint 1 — vanilla HTML/CSS/JS frontend, no framework, no build step. json-server backend on `http://localhost:3000`, serving `db.json`.

**Sprint 2 Goal:** A user can mark tasks complete, delete tasks, and filter the list by status — completing the full CRUD + view feature set.

---

## No New Scaffolding Required

Sprint 2 extends the existing project from Sprint 1 — do not re-init `package.json`, do not create new folders, do not add new dependencies. Everything needed (json-server, `serve`, `concurrently`) is already installed and running via `npm start`.

**Files this sprint modifies (no new files):**
- `public/index.html` — add filter controls (All / Active / Completed)
- `public/style.css` — style for completed tasks (e.g. strikethrough), delete button, active filter state
- `public/app.js` — extend the existing render function, add toggle/delete handlers, add filter state

**Guardrail:** Do not introduce a new JS file, a state-management library, or a templating library to implement the filter. It's a single client-side variable and a re-render — consistent with `architecture.md`'s Filter Controller design.

---

## Schema (unchanged from Sprint 1)

`Task` object shape:
| Field | Type | Notes |
|---|---|---|
| `id` | number | Auto-assigned by json-server. Never sent by client. |
| `title` | string | Set in Sprint 1, not editable this sprint. |
| `completed` | boolean | Now toggleable via this sprint's PATCH endpoint. |

No schema changes. No migration needed on `db.json`.

---

## US-3: Mark a task complete or incomplete

**As a user, I want to toggle a task's status between complete and incomplete, so that I can track my progress on my to-dos.**

### Endpoint
`PATCH /tasks/:id`

### Request
```json
{ "completed": true }
```
(or `false`, depending on the current state being toggled)

### Response — 200 OK
```json
{ "id": 1, "title": "Buy milk", "completed": true }
```

### Response — 404 Not Found
Returned if `:id` no longer exists (e.g., deleted in another tab). See Error Handling below.

### Implementation requirements
- Each rendered task gets an interactive checkbox (this sprint makes it live — in Sprint 1 it was rendered as disabled/read-only).
- On checkbox click: immediately flip the visual state (optimistic update — strikethrough or equivalent), then send `PATCH /tasks/:id` with the new `completed` value.
- On `200` success: confirm the local task array reflects the new state (already updated optimistically) — no further action needed.
- On failure (network error or `404`): revert the checkbox to its prior visual state and show an inline error near that task (e.g., "Couldn't update task — try again"). If `404`, also remove the task from the local array and re-render, since it no longer exists on the backend.
- The checkbox must be operable via keyboard (native `<input type="checkbox">` handles this for free — don't replace it with a styled `<div>` that loses keyboard/focus behavior).

### Acceptance Criteria (from user-stories.md)
- Given an incomplete task, when I click its checkbox/toggle, then it is visually marked complete (e.g., strikethrough) immediately.
- Given a completed task, when I click its checkbox/toggle again, then it reverts to incomplete immediately.
- Given I toggled a task's status, when I refresh the page, then the task shows the same status I last set (confirming it was persisted to the backend).

---

## US-4: Delete a task

**As a user, I want to delete a task from my list, so that I can remove things I no longer need to track.**

### Endpoint
`DELETE /tasks/:id`

### Request
No body.

### Response — 200 OK
```json
{}
```

### Response — 404 Not Found
Returned if `:id` no longer exists (already deleted, e.g. from another tab).

### Implementation requirements
- Each rendered task gets a delete control (e.g., a small "×" or trash-icon button).
- On click: remove the task from the visible list immediately (optimistic update), then send `DELETE /tasks/:id`.
- On success: no further action — the optimistic removal already reflects the correct state.
- On failure (network error): re-insert the task back into the list at its prior position and show an inline error (e.g., "Couldn't delete task — try again"). A `404` on delete can be treated as success (the end state — task gone — matches what the user wanted), so no rollback is needed in that specific case.
- Deleting one task must not affect any other task in the list — verify only the matching `id` is removed from the local array.
- No confirmation dialog is required this sprint (optional/nice-to-have per `user-stories.md`, not in scope here — keep it a single click for the demo).

### Acceptance Criteria (from user-stories.md)
- Given a task in the list, when I click its delete control, then it is immediately removed from the visible list.
- Given I deleted a task, when I refresh the page, then the deleted task does not reappear (confirming it was removed from the backend).
- Given a list with multiple tasks, when I delete one task, then only that task is removed and all other tasks remain unaffected.

---

## US-5: Filter tasks by status

**As a user, I want to filter my task list by All, Active, or Completed, so that I can focus on just the tasks that matter to me right now.**

### Endpoint
None — this is entirely client-side. Do not add a query param to `GET /tasks` or call the API on filter change.

### Implementation requirements
- Three controls (e.g., buttons or a tab group) labeled "All", "Active", "Completed".
- Store the current filter as a single JS variable (e.g., `currentFilter`), defaulting to `"all"` on page load.
- On filter selection: update `currentFilter` and re-render the list from the existing in-memory task array — filtering it in JS (`tasks.filter(t => ...)`), with no network request.
- Filter logic: `"all"` → show every task; `"active"` → show only tasks where `completed === false`; `"completed"` → show only tasks where `completed === true`.
- Visually indicate which filter is currently active (e.g., a highlighted/pressed style on the selected button).
- Filter state does not need to persist across page reloads — it's fine for the app to reset to "All" on refresh (not specified as a requirement in `user-stories.md`).
- Filter controls must be reachable and operable via keyboard (use `<button>` elements, not `<div onclick>`).

### Acceptance Criteria (from user-stories.md)
- Given a mix of complete and incomplete tasks, when I select the "Active" filter, then only incomplete tasks are shown.
- Given a mix of complete and incomplete tasks, when I select the "Completed" filter, then only completed tasks are shown.
- Given any filter is applied, when I select "All", then every task is shown again, and switching filters does not trigger a page reload or backend call.

---

## Error Handling Contract (this sprint's endpoints)

| Status | Meaning | Frontend behavior |
|---|---|---|
| 200 (PATCH) | Toggle succeeded | Keep optimistic UI state as-is |
| 200 (DELETE) | Delete succeeded | Keep optimistic removal as-is |
| 404 (PATCH) | Task no longer exists | Remove from local array, re-render, show inline notice |
| 404 (DELETE) | Task already gone | Treat as success — no rollback needed |
| Network error (either) | Backend unreachable | Roll back the optimistic change, show inline error |

This is consistent with the error-handling approach established in `sprint1-implementation-spec.md` — optimistic UI with rollback on failure, never a silent mismatch between what's shown and what's on the backend.

---

## Interaction with Sprint 1 Code

- The render function built in Sprint 1 (for displaying the list / empty state) should be extended, not duplicated — it now needs to (a) apply the current filter before rendering, and (b) render live checkboxes and delete buttons instead of Sprint 1's static ones.
- The API-call helper from Sprint 1 (used for `GET`/`POST`) should be extended with `PATCH` and `DELETE` methods following the same pattern, rather than writing separate one-off `fetch()` calls.
- No changes are needed to `db.json`'s structure or to the `package.json` scripts from Sprint 1.

---

## Explicitly Out of Scope for Sprint 2
- Task editing (renaming an existing task's title) — not in any story, potential future work per `user-stories.md`'s Out of Scope section.
- Delete confirmation dialogs — noted as optional in `user-stories.md`, not implemented this sprint.
- Persisting the selected filter across page reloads.
- Accessibility beyond native keyboard operability of checkboxes/buttons (full ARIA labeling pass is still an open item per `design-review-notes.md` — worth doing before the live demo, but not blocking Sprint 2 functional completion).
- Double-submit guarding on delete (e.g., disabling the button mid-request) — acceptable to leave unhandled per the "deliberately deferred" note in `design-review-notes.md`.

---

## Setup Notes for the Coding Assistant
- The project is already scaffolded and running from Sprint 1 (`npm start` brings up json-server on port 3000 and the static frontend on port 5000). No setup steps are needed before starting this sprint's stories.
- Before implementing, confirm the Sprint 1 app is working end-to-end (view + add tasks) so Sprint 2 changes build on a known-good baseline.
