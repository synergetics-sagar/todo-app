# Sprint Plan — Todo List App

A 2-sprint plan built from the epics and user stories in `epics.md` and `user-stories.md`. Sprint 1 establishes the working foundation (view + add + persistence); Sprint 2 completes the remaining task actions and view controls.

---

## Sprint 1: Foundation — See and Add Tasks

**Sprint Goal:** By the end of this sprint, a user can open the app, see their persisted task list, and add new tasks that survive a page refresh.

| Story | Title | Epic | Size |
|---|---|---|---|
| US-2 | View my tasks | Task Visibility | S |
| US-1 | Add a task | Task Management | M |
| US-6 | Persist data across sessions | Data Persistence | S |

**Notes:**
- US-6 isn't a standalone feature to build in isolation — it's the backend wiring (json-server GET/POST) that US-1 and US-2 depend on, so it's delivered *through* those two stories rather than as separate work. Included here as its own line for traceability back to the epic.
- This sprint produces a genuinely usable (if minimal) app: view + add, persisted.

---

## Sprint 2: Task Actions and Filtering

**Sprint Goal:** By the end of this sprint, a user can mark tasks complete, delete tasks, and filter the list by status — completing the full CRUD + view feature set.

| Story | Title | Epic | Size |
|---|---|---|---|
| US-3 | Mark a task complete or incomplete | Task Management | S |
| US-4 | Delete a task | Task Management | S |
| US-5 | Filter tasks by status | Task Visibility | S |

**Notes:**
- All three stories build directly on the Sprint 1 foundation (rendered list + backend wiring), which is why they're smaller in size — the heavy lifting (fetch/render/persist plumbing) is already done.
- US-5 (filter) is purely client-side state, so it's the lowest-risk story of the two sprints.

---

## Sizing Key
- **S (Small):** Single, well-understood change; minimal new plumbing.
- **M (Medium):** New plumbing or a new interaction pattern (e.g., form handling + backend write) established for the first time.
- **L (Large):** Not used in this plan — no story in this app requires it, per the "no framework, no database server" constraints.

## Summary
| Sprint | Stories | Total Size |
|---|---|---|
| Sprint 1 | US-2, US-1, US-6 | S + M + S |
| Sprint 2 | US-3, US-4, US-5 | S + S + S |