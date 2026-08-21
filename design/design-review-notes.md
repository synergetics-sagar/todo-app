# Design Review Notes — Todo List App

Self-review of the architecture, API contract, and database schema against the requirements documents (`user-stories.md`, `non-functional-requirements.md`, `epics.md`, `sprint-plan.md`) before implementation begins.

---

## 1. Traceability Check

| Requirement | Addressed By | Status |
|---|---|---|
| US-1 Add a task | `POST /tasks`, Task Form Handler | ✅ Covered |
| US-2 View my tasks | `GET /tasks`, Renderer, empty-state handling | ✅ Covered |
| US-3 Toggle complete/incomplete | `PATCH /tasks/:id`, Task Item Controls | ✅ Covered |
| US-4 Delete a task | `DELETE /tasks/:id`, Task Item Controls | ✅ Covered |
| US-5 Filter by status | Client-side Filter Controller, no backend call | ✅ Covered |
| US-6 Persist across sessions | json-server + `db.json` as source of truth | ✅ Covered |

All 6 stories map cleanly to a component and/or endpoint. No orphaned requirements, no architecture components without a backing story.

---

## 2. Non-Functional Requirements Follow-Through

Checked against `non-functional-requirements.md`:

- **Error handling:** addressed in Architecture §3 and the API Contract's error table (404 / network error behavior defined).
- **Data limits:** addressed — 200 char recommendation carried into both `api-contract.md` and `database-schema.md`, and "a few hundred tasks" scale noted as the design assumption.
- **Security (XSS):** flagged in the architecture but **not yet an explicit implementation rule** — see Open Issue #1 below.
- **Accessibility:** **not addressed in any design doc so far.** The architecture doesn't specify semantic HTML, ARIA labels, or keyboard focus order. See Open Issue #2.
- **Reliability (double-submit, concurrent tabs):** double-submit isn't addressed anywhere yet. Concurrent-tab staleness is explicitly accepted in `database-schema.md`. See Open Issue #3.
- **Browser compatibility:** not addressed — no design doc states a target browser. Low risk given vanilla JS with no modern-only syntax planned, but worth a one-line decision.

---

## 3. Open Issues / Decisions Needed Before Implementation

1. **XSS mitigation isn't an explicit rule yet.** The architecture *mentions* rendering safely, but no doc states "always use `textContent`, never `innerHTML`, for task titles" as a hard rule. Recommend adding this as an explicit implementation note before Sprint 1 coding starts, since it's cheap to do right the first time and awkward to retrofit.

2. **Accessibility has no design owner.** None of the 4 design docs mention semantic elements (`<button>` vs `<div onclick>`), label associations for the checkbox, or keyboard tab order. Recommend a short "Accessibility Notes" addendum before Sprint 1, since retrofitting ARIA attributes after the DOM structure is built is more rework than designing it in from the start.

3. **Double-submit guard undecided.** Should the Add button disable briefly after submit, or is duplicate-task risk acceptable to leave unhandled for a demo app? Recommend explicitly deferring this (document the decision, don't silently skip it) since it's genuinely low-stakes for a single-user demo.

4. **Optimistic UI vs. wait-for-response.** The architecture assumes optimistic updates with rollback-on-failure (§3), but this wasn't explicitly decided in the NFR doc — it was a recommendation, not a confirmed choice. Worth a quick confirmation since it affects how the Task Form Handler and Task Item Controls are implemented.

5. **json-server CORS/port setup isn't specified.** Architecture §5 assumes frontend and backend run on different local ports, which requires json-server's CORS to be enabled (it is, by default) — but the exact ports and how the frontend is served (e.g., `npx serve` vs. opening `index.html` directly via `file://`) aren't pinned down. `file://` origins can behave inconsistently with `fetch()` in some browsers — recommend serving the frontend from a local HTTP server too, not opening the file directly.

---

## 4. Things Deliberately Kept Simple (and why that's fine here)

- **No client-side framework, no state management library** — appropriate given the constraint and the small surface area (6 stories, 1 resource).
- **No database beyond a flat JSON file** — appropriate at the stated scale; explicitly flagged as a limitation rather than an oversight.
- **No auth** — consistent with the explicit "no login, single shared list" requirement; documented as an accepted trade-off, not a gap.

---

## 5. Recommendation

Architecture, API contract, and schema are internally consistent and fully trace back to the 6 user stories. Before Sprint 1 begins, resolve Open Issues #1 and #2 (XSS rule, accessibility basics) since they're cheapest to bake in now — #3, #4, and #5 can be quick one-line decisions logged here rather than blocking design sign-off.
