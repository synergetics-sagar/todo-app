# User Stories — Todo List App

**Context:** Single-user, no-auth todo list app. Vanilla HTML/CSS/JS frontend, json-server backend. Data persists across page refresh via the backend.

---

### US-1: Add a task
**As a** user, **I want** to add a new task to my list, **so that** I can keep track of something I need to do.

**Acceptance Criteria:**
- **Given** the input field has a non-empty task description, **when** I submit it (click "Add" or press Enter), **then** the task appears in the list immediately.
- **Given** a task was just added, **when** I refresh the page, **then** the task is still present (confirming it was saved to the backend).
- **Given** the input field is empty or contains only whitespace, **when** I try to submit it, **then** no task is added and the list is unchanged.

---

### US-2: View my tasks
**As a** user, **I want** to see all my tasks when I open the app, **so that** I know what's on my list without having to re-enter anything.

**Acceptance Criteria:**
- **Given** tasks exist in the backend, **when** I open or refresh the app, **then** all tasks are fetched and rendered on screen.
- **Given** a task is rendered, **when** I look at it, **then** it clearly shows its description and whether it's complete or incomplete.
- **Given** no tasks exist in the backend, **when** I open the app, **then** a friendly empty-state message is shown instead of a blank list.

---

### US-3: Mark a task complete or incomplete
**As a** user, **I want** to toggle a task's status between complete and incomplete, **so that** I can track my progress on my to-dos.

**Acceptance Criteria:**
- **Given** an incomplete task, **when** I click its checkbox/toggle, **then** it is visually marked complete (e.g., strikethrough) immediately.
- **Given** a completed task, **when** I click its checkbox/toggle again, **then** it reverts to incomplete immediately.
- **Given** I toggled a task's status, **when** I refresh the page, **then** the task shows the same status I last set (confirming it was persisted to the backend).

---

### US-4: Delete a task
**As a** user, **I want** to delete a task from my list, **so that** I can remove things I no longer need to track.

**Acceptance Criteria:**
- **Given** a task in the list, **when** I click its delete control, **then** it is immediately removed from the visible list.
- **Given** I deleted a task, **when** I refresh the page, **then** the deleted task does not reappear (confirming it was removed from the backend).
- **Given** a list with multiple tasks, **when** I delete one task, **then** only that task is removed and all other tasks remain unaffected.

---

### US-5: Filter tasks by status
**As a** user, **I want** to filter my task list by All, Active, or Completed, **so that** I can focus on just the tasks that matter to me right now.

**Acceptance Criteria:**
- **Given** a mix of complete and incomplete tasks, **when** I select the "Active" filter, **then** only incomplete tasks are shown.
- **Given** a mix of complete and incomplete tasks, **when** I select the "Completed" filter, **then** only completed tasks are shown.
- **Given** any filter is applied, **when** I select "All", **then** every task is shown again, and switching filters does not trigger a page reload or backend call.

---

### US-6: Persist data across sessions
**As a** user, **I want** my tasks to remain saved when I close and reopen the app, **so that** I don't lose my list between sessions.

**Acceptance Criteria:**
- **Given** I add, toggle, or delete a task, **when** the action completes, **then** the change is written to the json-server backend (not just held in browser memory).
- **Given** the app was closed or the tab was fully closed and reopened, **when** I reopen the app, **then** the list reflects the exact state it was in before closing.
- **Given** the app has no login flow, **when** any user opens the app, **then** they see the same single shared list with no user-specific data or identifier required.

---

## Out of Scope (explicitly excluded per constraints)
- User authentication / accounts
- Multi-user support or per-user lists
- Task editing (rename/reschedule) — not requested, can be a future story
- Due dates, priorities, tags, or sorting — not requested, can be a future story
- Any frontend framework (React, Vue, etc.) or database server beyond json-server