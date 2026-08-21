# Architecture — Todo List App

Derived from `user-stories.md`, `non-functional-requirements.md`, and the stated constraints: no auth, no multi-user, vanilla HTML/CSS/JS frontend, json-server backend, no framework, no database server.

---

## 1. High-Level Architecture

A simple two-tier client-server architecture:

```
┌─────────────────────────┐        HTTP (fetch)        ┌──────────────────────┐
│   Browser (Frontend)    │ ◄─────────────────────────► │  json-server (API)   │
│                          │      JSON over REST         │                      │
│  index.html              │                              │  db.json (file)      │
│  style.css                │                              │                      │
│  app.js                   │                              └──────────────────────┘
└─────────────────────────┘
```

- **Frontend:** Vanilla HTML/CSS/JS, no build step, no framework. Runs entirely in the browser.
- **Backend:** json-server, a zero-code REST API generated from a JSON file (`db.json`). Provides GET/POST/PATCH/DELETE on a `/tasks` resource.
- **Persistence:** `db.json` on disk, written to by json-server on every mutating request. This satisfies US-6 (persist data across sessions) without a real database server.

## 2. Component Breakdown (Frontend)

Kept minimal on purpose — no framework, so structure is a few plain JS modules/functions rather than components in the React/Vue sense:

| Component | Responsibility | Related Stories |
|---|---|---|
| **Renderer** | Builds/updates the DOM list from in-memory task data | US-2 |
| **Task Form Handler** | Captures input, validates non-empty, triggers add | US-1 |
| **Task Item Controls** | Checkbox toggle + delete button per task, wired to backend calls | US-3, US-4 |
| **Filter Controller** | Tracks current filter (All/Active/Completed) as client-side state, re-renders on change | US-5 |
| **API Client** | Thin wrapper around `fetch()` for GET/POST/PATCH/DELETE to json-server | US-1, US-2, US-3, US-4, US-6 |

There is no client-side router and no build tooling — a single `index.html` loads `app.js` as a module.

## 3. State Management

- **Source of truth:** the backend (`db.json` via json-server). The frontend does not treat browser memory as authoritative.
- **In-memory cache:** on load, the app fetches all tasks once into a local array; UI renders from that array. Every mutation (add/toggle/delete) calls the backend, and on success, updates the local array and re-renders.
- **Filter state:** purely client-side (not persisted, not sent to backend) — satisfies US-5's requirement that filtering doesn't require a backend call.
- **Error handling (per NFR §1):** if a backend call fails, the local array change is rolled back and an inline error message is shown, rather than silently drifting from backend state.

## 4. Why json-server (and its implications)

json-server was chosen per the stated constraint (no framework, no database server) and is well suited to a course demo — it stands up a working REST API from a single JSON file with no backend code to write. Implications worth carrying into the API contract and NFRs:

- No authentication or authorization is enforced by json-server by default — consistent with the "no login" requirement, but it means anyone who can reach the server can read/write the list (see NFR §4, Security).
- json-server auto-generates conventional REST routes and an auto-incrementing `id` field, which shapes the API contract (see `api-contract.md`).
- Data storage is a flat JSON file, not a query-optimized database — fine at the "few hundred tasks" scale noted in the NFRs, not intended to scale beyond that.

## 5. Deployment / Runtime Model

- Both frontend and backend run **locally** for this course/demo context (e.g., `npx json-server db.json` on one port, static files served or opened directly on another).
- No CORS concerns beyond enabling json-server's default CORS support so the frontend (served from a different port) can call it.
- No environment-specific configuration (dev/staging/prod) — single local environment, consistent with the "single shared list" and no-auth scope.

## 6. Mapping to Epics

| Epic | Architectural Concern |
|---|---|
| Task Management (US-1, US-3, US-4) | API Client + Task Form Handler + Task Item Controls |
| Task Visibility (US-2, US-5) | Renderer + Filter Controller |
| Data Persistence (US-6) | json-server + db.json, accessed via API Client |
