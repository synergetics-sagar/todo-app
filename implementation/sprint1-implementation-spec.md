# Sprint 1 Implementation Spec — Todo List App

**Purpose:** Implementation-ready handoff for an AI coding assistant (GitHub Copilot). Covers Sprint 1 only, per `sprint-plan.md`: US-2 (View), US-1 (Add), US-6 (Persist). Built from `architecture.md`, `api-contract.md`, and `database-schema.md`.

**Stack:** Vanilla HTML/CSS/JS frontend, no framework, no build step. json-server backend on `http://localhost:3000`, serving `db.json`.

**Sprint 1 Goal:** A user can open the app, see their persisted task list, and add new tasks that survive a page refresh.

---

## Project Scaffolding (do this first, before any story below)

The coding assistant should generate this exact structure and setup — do not introduce a framework, bundler, or build step of any kind. This is a deliberately minimal, flat project.

### Folder layout
```
todo-app/
├── package.json
├── db.json
├── public/
│   ├── index.html
│   ├── style.css
│   └── app.js
```

### `package.json`
Initialize with `npm init -y`, then set it up as:
```json
{
  "name": "todo-app",
  "version": "1.0.0",
  "private": true,
  "scripts": {
    "start:api": "json-server --watch db.json --port 3000",
    "start:web": "serve public -l 5000",
    "start": "concurrently \"npm:start:api\" \"npm:start:web\""
  },
  "devDependencies": {
    "json-server": "^0.17.4",
    "serve": "^14.2.0",
    "concurrently": "^8.2.0"
  }
}
```
- Install with: `npm install`
- `npm start` runs both the API (port 3000) and the static frontend (port 5000) together, so there's a single command for the whole demo.
- `npm run start:api` / `npm run start:web` are available individually for debugging.

### `db.json` (initial seed file, at project root)
```json
{
  "tasks": []
}
```

### `public/index.html`
Create as a bare, minimal HTML shell only — no story-specific markup yet:
```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Todo App</title>
  <link rel="stylesheet" href="style.css">
</head>
<body>
  <script type="module" src="app.js"></script>
</body>
</html>
```
All feature markup (input field, task list container, filter controls, etc.) is added later, per the requirements in each user story's implementation section below — do not add it now.

### `public/style.css`
Create as an empty file. Styling is added per-story as each feature is implemented — do not pre-style anything now.

### `public/app.js`
Create as an empty file (or with a single comment, e.g. `// Todo app logic`). No functions, no fetch calls, no logic — do not write any code here at scaffolding time.

### Guardrails for the coding assistant
- Do NOT scaffold with React, Vue, Vite, Webpack, or any CLI generator (e.g. `create-react-app`) — this project is intentionally framework-free per the course's stated constraints.
- Do NOT add TypeScript, ESLint configs, or testing libraries in this step — those are out of scope for Sprint 1 scaffolding (testing tooling arrives in a later sprint per `epics.md` / `sprint-plan.md`).
- Do NOT create a `src/` directory or any build/compile step — `public/app.js` is served as-is, unbundled.
- After scaffolding, verify `npm start` brings up both servers without errors before writing any story logic.

---

## Cross-Cutting Implementation Notes (apply to every story below)
- No CSS framework (no Bootstrap/Tailwind CDN) — plain CSS only, consistent with the "no framework" constraint from `user-stories.md`.
- No inline `<script>` in `index.html` — all JS logic lives in `app.js`.
- `app.js` stays a single ES module, no bundler. Structure it as a few plain functions (not classes) matching the component breakdown in `architecture.md`: an API-call helper, a render function, and a form submit handler — split further only if a later sprint genuinely requires it.

---

## Schema (shared across all stories this sprint)

`db.json`:
```json
{
  "tasks": []
}
```

`Task` object shape:
| Field | Type | Notes |
|---|---|---|
| `id` | number | Auto-assigned by json-server on POST. Never sent by client. |
| `title` | string | Required, non-empty after trim. Max 200 chars. |
| `completed` | boolean | Always `false` on creation in this sprint (toggle is Sprint 2). |

---

## US-2: View my tasks

**As a user, I want to see all my tasks when I open the app, so that I know what's on my list without re-entering anything.**

### Endpoint
`GET /tasks`

### Request
No body, no params.

### Response — 200 OK
```json
[
  { "id": 1, "title": "Buy milk", "completed": false },
  { "id": 2, "title": "Walk the dog", "completed": true }
]
```
Empty list: `[]`

### Implementation requirements
- On page load (`DOMContentLoaded` or module init), call `GET /tasks` and render the result.
- Each task in the DOM must show: `title` text and a visual indicator of `completed` status (checkbox reflects the boolean; for this sprint, no toggle interaction is wired yet since that's Sprint 2 — render the checkbox as disabled or read-only).
- If the response array is empty, render an empty-state message (e.g., "No tasks yet — add one below") instead of an empty list container.
- If the fetch fails (network error, non-2xx), render a visible error message (e.g., "Couldn't load tasks — is the server running?") instead of a blank screen or console-only error.
- Render task `title` using `textContent` (or equivalent safe DOM API) — never `innerHTML` — to prevent script injection from stored task text.

### Acceptance Criteria (from user-stories.md)
- Given tasks exist in the backend, when I open or refresh the app, then all tasks are fetched and rendered on screen.
- Given a task is rendered, when I look at it, then it clearly shows its description and whether it's complete or incomplete.
- Given no tasks exist in the backend, when I open the app, then a friendly empty-state message is shown instead of a blank list.

---

## US-1: Add a task

**As a user, I want to add a new task to my list, so that I can keep track of something I need to do.**

### Endpoint
`POST /tasks`

### Request
```json
{ "title": "Buy milk", "completed": false }
```
`title` is required and must be non-empty after trimming whitespace. Client-side validation only — json-server does not validate the payload.

### Response — 201 Created
```json
{ "id": 3, "title": "Buy milk", "completed": false }
```

### Implementation requirements
- A text input plus a submit control (button and/or Enter key) for entering a new task title.
- Before sending the request: trim the input value; if empty, do not submit — leave the list unchanged and give the user a visible cue (e.g., disabled submit button while empty, or an inline validation message). Do not call the API with an empty/whitespace-only title.
- Enforce a max length of 200 characters on the input (`maxlength="200"` on the `<input>` is sufficient for this sprint).
- On successful `201` response: append the returned task object (with server-assigned `id`) to the in-memory task array, re-render the list, and clear the input field.
- On failure (network error or non-2xx): do not clear the input, and show an inline error message near the form (e.g., "Couldn't add task — try again").
- Render the newly added task using the same safe-rendering rule as US-2 (`textContent`, not `innerHTML`).

### Acceptance Criteria (from user-stories.md)
- Given the input field has a non-empty task description, when I submit it (click "Add" or press Enter), then the task appears in the list immediately.
- Given a task was just added, when I refresh the page, then the task is still present (confirming it was saved to the backend).
- Given the input field is empty or contains only whitespace, when I try to submit it, then no task is added and the list is unchanged.

---

## US-6: Persist data across sessions

**As a user, I want my tasks to remain saved when I close and reopen the app, so that I don't lose my list between sessions.**

This story has no endpoint of its own in Sprint 1 — it's satisfied by US-1 and US-2 both talking to the real backend (json-server writing to `db.json`) rather than to any in-memory-only or browser-storage mock. Implemented and verified as an integration outcome of the two stories above.

### Implementation requirements
- Do not use `localStorage`, `sessionStorage`, or any in-memory-only array as the source of truth. The backend (`db.json` via json-server) is the single source of truth.
- The in-memory task array in the frontend is a *cache* of the last successful `GET /tasks` / `POST /tasks` response — not authoritative state. On every page load, it must be repopulated from `GET /tasks`, not restored from any client-side storage.
- No user identifier, login, or session token — single shared list, consistent with the no-auth constraint.

### Acceptance Criteria (from user-stories.md)
- Given I add a task, when the action completes, then the change is written to the json-server backend (not just held in browser memory). *(Toggle/delete criteria apply in Sprint 2 — not implemented yet.)*
- Given the app was closed and reopened, when I reopen it, then the list reflects the exact state it was in before closing.
- Given no login flow exists, when the app is opened, then it shows the same single shared list with no user-specific data required.

---

## Error Handling Contract (applies to both endpoints this sprint)

| Status | Meaning | Frontend behavior |
|---|---|---|
| 200 (GET) | Tasks fetched | Render list or empty state |
| 201 (POST) | Task created | Append to list, clear input |
| Network error / no response | Backend unreachable | Show error banner; do not apply any optimistic UI change |

No 4xx validation responses are expected from json-server for these two endpoints — all input validation (non-empty title, 200-char max) happens client-side before the request is sent.

---

## Explicitly Out of Scope for Sprint 1
(Per `sprint-plan.md` — these belong to Sprint 2 or later)
- `PATCH /tasks/:id` (toggle complete/incomplete) — US-3
- `DELETE /tasks/:id` (delete a task) — US-4
- Client-side filter UI (All/Active/Completed) — US-5
- Any interactive checkbox behavior beyond a static, non-interactive display of `completed` status
- Accessibility (ARIA labels, keyboard nav) and double-submit guarding are noted in `design-review-notes.md` as open issues — not blocking for Sprint 1 functional completion but worth a pass before demo if time allows.

---

## Setup Notes for the Coding Assistant
- Full scaffolding steps (folder layout, `package.json`, install/run commands) are specified above in **Project Scaffolding** — follow that section first, before implementing any story.
- The frontend is served from a local HTTP server (`serve`, port 5000), not opened via `file://`, to avoid `fetch()` inconsistencies with `file://` origins (per `design-review-notes.md`, Open Issue #5).
- json-server's default CORS support handles cross-port calls from the frontend (port 5000) to the API (port 3000) — no additional CORS configuration should be needed.