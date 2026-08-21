# Non-Functional Requirements — Todo List App

The user stories in `user-stories.md` cover *what* the app does. This document flags *how well* it should do it — gaps not addressed by the functional requirements but worth deciding on now, before implementation starts. Each item below is written as a question/recommendation for you to accept, adjust, or explicitly defer.

---

## 1. Error Handling
Not covered by the functional stories: what happens when things go wrong.

- **Backend unreachable / json-server not running:** what does the user see? (Recommendation: a visible error banner/message, not a silent blank list or a browser console error only.)
- **Failed add/toggle/delete request:** does the UI roll back the optimistic change, retry, or just show an error? (Recommendation: revert the UI change and show an inline error if the backend call fails.)
- **Malformed or unexpected response from json-server:** should the app fail gracefully (e.g., show "couldn't load tasks") rather than crash the page.

## 2. Data Limits
Not covered: how much data the app is expected to handle.

- **Max task description length:** unbounded text could break layout or hit backend limits. (Recommendation: cap at ~200 characters with a visible limit/counter.)
- **Max number of tasks:** json-server (a JSON file) will slow down or become unwieldy with very large lists. (Recommendation: define an expected scale, e.g. "up to a few hundred tasks," since this is a personal single-user list.)
- **Special characters / HTML in task text:** should be handled safely (see Security below) rather than limited outright.

## 3. Performance
Not covered: responsiveness expectations.

- **List rendering:** re-rendering the full list on every add/toggle/delete is fine at small scale — worth confirming that's acceptable rather than requiring incremental DOM updates.
- **Perceived responsiveness:** should toggling/adding feel instant (optimistic UI update before backend confirms), or is it acceptable to wait for the backend response before updating the screen?
- **Load time:** no specific target needed given the vanilla JS/no-framework stack, but worth noting there's no lazy-loading/pagination — the whole list loads at once.

## 4. Security
Not covered: this is a personal single-user app, but a few basics still apply.

- **XSS / script injection via task text:** if task descriptions are rendered as raw HTML, a task like `<script>...</script>` could execute. (Recommendation: always render task text safely, e.g. via `textContent`, not `innerHTML`.)
- **No auth = no access control:** explicitly confirm this is acceptable — anyone with network access to the backend/frontend can view or modify the list. Fine for local/personal use; worth flagging if this ever gets deployed beyond localhost.
- **CORS / exposed json-server:** if json-server is ever bound to a network interface rather than localhost, its default lack of auth means anyone on the network could read/write the list.

## 5. Accessibility
Not covered: usability for assistive technology and keyboard-only users.

- **Keyboard operability:** can a user add, toggle, delete, and filter tasks using only the keyboard (Tab/Enter/Space), with no mouse?
- **Screen reader support:** do checkboxes, buttons, and filter controls have proper labels (e.g. `aria-label`, associated `<label>` elements) so a screen reader announces them meaningfully?
- **Color/contrast:** if "completed" is shown only via color (e.g., greyed out), is there a secondary visual cue (like strikethrough) for colorblind users or low contrast screens?

## 6. Browser / Environment Compatibility
Not covered: where this needs to run.

- **Target browsers:** any minimum browser support needed (e.g., latest Chrome/Firefox/Safari only), given vanilla JS with no build step or polyfills?
- **Responsive/mobile layout:** should the app be usable on a phone-sized screen, or is desktop-only acceptable?

## 7. Reliability / Data Integrity
Not covered: concurrent or repeated actions.

- **Rapid double-submit:** clicking "Add" or "Delete" twice quickly — should the app guard against duplicate tasks or duplicate delete requests?
- **Concurrent tabs:** if the app is open in two browser tabs at once, is it acceptable for one tab to show stale data until refreshed, or should state sync live? (Recommendation: accept staleness — out of scope for a simple personal app, but worth noting explicitly.)

---

## Suggested Priority (for a simple personal-use app)
**Must address before build:** Error handling (backend unreachable), Security (safe text rendering), basic Accessibility (keyboard + labels).
**Good to decide, low effort:** Data limits (max length), optimistic vs. wait-for-response UI.
**Fine to explicitly defer:** Multi-tab sync, large-scale performance tuning, mobile responsiveness (unless you want it).