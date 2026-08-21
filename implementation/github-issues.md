# GitHub Issues — Todo List App

Ready-to-paste issue content for all 6 user stories, ordered per `sprint-plan.md` (Sprint 1 first, then Sprint 2). Each block below is one GitHub issue: copy the **Title** as the issue title, and everything under **Body** into the issue description.

Issue #1 ("Create scaffolding and dependencies") is already created — these continue from #2.

---

## Issue #2

**Title:**
```
US-2: View my tasks
```

**Body:**
```
## User Story
As a user, I want to see all my tasks when I open the app, so that I know what's on my list without having to re-enter anything.

## Sprint / Epic
Sprint 1 · Epic: Task Visibility

## Acceptance Criteria
- Given tasks exist in the backend, when I open or refresh the app, then all tasks are fetched and rendered on screen.
- Given a task is rendered, when I look at it, then it clearly shows its description and whether it's complete or incomplete.
- Given no tasks exist in the backend, when I open the app, then a friendly empty-state message is shown instead of a blank list.

## Reference
See `implementation/sprint1-implementation-spec.md`, section "US-2: View my tasks" for the exact endpoint, request/response shape, and implementation requirements.
```

---

## Issue #4

**Title:**
```
US-1: Add a task
```

**Body:**
```
## User Story
As a user, I want to add a new task to my list, so that I can keep track of something I need to do.

## Sprint / Epic
Sprint 1 · Epic: Task Management

## Acceptance Criteria
- Given the input field has a non-empty task description, when I submit it (click "Add" or press Enter), then the task appears in the list immediately.
- Given a task was just added, when I refresh the page, then the task is still present (confirming it was saved to the backend).
- Given the input field is empty or contains only whitespace, when I try to submit it, then no task is added and the list is unchanged.

## Reference
See `implementation/sprint1-implementation-spec.md`, section "US-1: Add a task" for the exact endpoint, request/response shape, and implementation requirements.
```

---

## Issue #5

**Title:**
```
US-6: Persist data across sessions
```

**Body:**
```
## User Story
As a user, I want my tasks to remain saved when I close and reopen the app, so that I don't lose my list between sessions.

## Sprint / Epic
Sprint 1 · Epic: Data Persistence

## Acceptance Criteria
- Given I add a task, when the action completes, then the change is written to the json-server backend (not just held in browser memory).
- Given the app was closed and reopened, when I reopen it, then the list reflects the exact state it was in before closing.
- Given no login flow exists, when the app is opened, then it shows the same single shared list with no user-specific data required.

## Reference
This story has no endpoint of its own — it's satisfied by US-1 and US-2 both writing to and reading from the real json-server backend rather than any mock or client-side-only storage. See `implementation/sprint1-implementation-spec.md`, section "US-6: Persist data across sessions".

## Note
This issue is naturally resolved as a side effect of implementing #2 and #3 correctly — consider closing it as part of the same PR that resolves those, with a verification note (e.g. "verified via page refresh") rather than separate implementation work.
```

---

## Issue #6

**Title:**
```
US-3: Mark a task complete or incomplete
```

**Body:**
```
## User Story
As a user, I want to toggle a task's status between complete and incomplete, so that I can track my progress on my to-dos.

## Sprint / Epic
Sprint 2 · Epic: Task Management

## Acceptance Criteria
- Given an incomplete task, when I click its checkbox/toggle, then it is visually marked complete (e.g., strikethrough) immediately.
- Given a completed task, when I click its checkbox/toggle again, then it reverts to incomplete immediately.
- Given I toggled a task's status, when I refresh the page, then the task shows the same status I last set (confirming it was persisted to the backend).

## Reference
See `implementation/sprint2-implementation-spec.md`, section "US-3: Mark a task complete or incomplete" for the exact endpoint, request/response shape, and implementation requirements.

## Depends On
#2, #3 (requires the existing render + API-call foundation from Sprint 1)
```

---

## Issue #7

**Title:**
```
US-4: Delete a task
```

**Body:**
```
## User Story
As a user, I want to delete a task from my list, so that I can remove things I no longer need to track.

## Sprint / Epic
Sprint 2 · Epic: Task Management

## Acceptance Criteria
- Given a task in the list, when I click its delete control, then it is immediately removed from the visible list.
- Given I deleted a task, when I refresh the page, then the deleted task does not reappear (confirming it was removed from the backend).
- Given a list with multiple tasks, when I delete one task, then only that task is removed and all other tasks remain unaffected.

## Reference
See `implementation/sprint2-implementation-spec.md`, section "US-4: Delete a task" for the exact endpoint, request/response shape, and implementation requirements.

## Depends On
#2, #3 (requires the existing render + API-call foundation from Sprint 1)
```

---

## Issue #8

**Title:**
```
US-5: Filter tasks by status
```

**Body:**
```
## User Story
As a user, I want to filter my task list by All, Active, or Completed, so that I can focus on just the tasks that matter to me right now.

## Sprint / Epic
Sprint 2 · Epic: Task Visibility

## Acceptance Criteria
- Given a mix of complete and incomplete tasks, when I select the "Active" filter, then only incomplete tasks are shown.
- Given a mix of complete and incomplete tasks, when I select the "Completed" filter, then only completed tasks are shown.
- Given any filter is applied, when I select "All", then every task is shown again, and switching filters does not trigger a page reload or backend call.

## Reference
See `implementation/sprint2-implementation-spec.md`, section "US-5: Filter tasks by status" for the exact endpoint, request/response shape, and implementation requirements. Note: this story has no backend endpoint — filtering is entirely client-side.

## Depends On
#2, #3 (requires the existing render + API-call foundation from Sprint 1)
```

---

## Suggested Labels (optional, if you use GitHub labels)
- `sprint-1` → issues #2, #3, #4
- `sprint-2` → issues #5, #6, #7
- `epic:task-management` → #3, #5, #6
- `epic:task-visibility` → #2, #7
- `epic:data-persistence` → #4

## Suggested Milestones (optional)
- **Sprint 1** milestone → #2, #3, #4
- **Sprint 2** milestone → #5, #6, #7
