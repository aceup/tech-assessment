# Findings

**Seed: `2417`**, confirmed by email on 28 Aug 2026.
Chrome 141 on macOS 15, viewport 1400x900 unless a finding says otherwise, app served over
HTTP at `http://localhost:4173`.

## Functional bugs

Nine defects, ordered by severity. Each has its own folder with a self-contained write-up
(steps from a clean state, expected, actual, where I think the cause is) and its annotated
screenshots next to it. Red boxes mark the defect, green boxes mark what the user did.

| Folder | What breaks | Severity | Priority | Shots |
|---|---|---|---|:--:|
| [`BUG-01`](BUG-01/README.md) | the time you book is not the time you see | Critical | P0 | 2 |
| [`BUG-09`](BUG-09/README.md) | an unknown coach id books someone else entirely | Critical | P0 | 1 |
| [`BUG-03`](BUG-03/README.md) | page 2 throws away the search filter | High | P1 | 1 |
| [`BUG-05`](BUG-05/README.md) | an invalid guest email blocks the booking and says nothing | High | P1 | 1 |
| [`BUG-06`](BUG-06/README.md) | cancelling leaves the dashboard count and the coach's slot stale | High | P1 | 2 |
| [`BUG-08`](BUG-08/README.md) | one long word in the notes pushes Cancel off the screen | High | P1 | 1 |
| [`BUG-11`](BUG-11/README.md) | past sessions are counted and announced as upcoming | High | P1 | 1 |
| [`BUG-02`](BUG-02/README.md) | searching a name without its accent finds nothing | Medium | P1 | 2 |
| [`BUG-07`](BUG-07/README.md) | session notes are cut at 280 characters without saying so | Medium | P2 | 1 |

## Everything else

| | |
|---|---|
| [`ux/`](ux/README.md) | 11 usability and accessibility findings, grouped into four themes. Two of them are more serious than anything above. |
| [`observations/`](observations/README.md) | Three smaller defects that reproduce but did not warrant a ticket. |
| [`SCOPE_COVERAGE.md`](SCOPE_COVERAGE.md) | What I checked and found working, which build constraints I chose not to report, and what I did not get to. |

Read the scope document alongside the bug list. What a test pass declares it did not look at
matters as much as what it found.

## Reproducing any of these

1. Start the app: `make start SEED=2417` from `tech-assessment/qa/`, or
   `cd app && python3 -m http.server 4173` if you would rather skip Docker.
2. Open `http://localhost:4173/index.html?seed=2417` and check the footer says **build 2417**.
3. Clear state before each run:
   ```js
   Object.keys(localStorage).filter(k => k.startsWith('aceup.')).forEach(k => localStorage.removeItem(k));
   ```
4. Follow the steps in that finding's write-up.

One warning, from BUG-12 in `observations/`: a URL with a malformed seed (`?seed=abc`)
switches you to build 1000 and overwrites the stored seed. If the footer stops saying 2417,
reopen `index.html?seed=2417`.
