# AceUp Console: QA assessment

**Build seed: `2417`**

Everything in this repo was tested against that seed. The app behaves differently on other
seeds, so the bugs below may not reproduce without it.

## Running the suite

Docker is all you need:

```bash
cd tech-assessment/qa
make start SEED=2417
make test SEED=2417
```

`make start` prints the URL. Check the footer says **build 2417** before you do anything else.

Natively, with Node 20+:

```bash
cd homework/starter
npm install
SEED=2417 npm run e2e
```

A single spec:

```bash
make test SEED=2417 ARGS="--spec cypress/e2e/booking.cy.js"
```

## What to expect when you run it

**21 tests pass, 15 fail.** The 15 failures are deliberate.

They live in `cypress/e2e/known-defects.cy.js` and assert what the app *should* do, so they
fail on this build and will go green as each bug is fixed. Every one is named after its bug
id (`BUG-01: shows the hour that was booked...`), so a failure list doubles as a list of what
is still broken. Nothing is skipped and none of them assert the buggy behaviour.

The other five specs pass. I ran the full suite three times back to back and got the same
result each time.

## What is here

| File | What it is |
|---|---|
| `BUG_REPORT.md` | 9 functional bugs, grouped by severity, with steps and priority |
| `UX_FINDINGS.md` | 11 usability and accessibility findings, grouped into four themes |
| `TEST_PLAN.md` | scope, what I automated and why, determinism, the three areas I would regression-test |
| [`findings/`](homework/findings/README.md) | one folder per bug, with annotated screenshots |
| [`findings/SCOPE_COVERAGE.md`](homework/findings/SCOPE_COVERAGE.md) | what I checked and found working, what I chose not to report, what I did not get to |
| `homework/starter/cypress/e2e/` | the suite |

`BUG_REPORT.md` is grouped by severity, so the two Critical ones are at the top.

## Where to start

The report opens with a summary table. If you only read one entry, read **BUG-09**. An unknown coach id in the URL books you with a
different coach than the one on screen, with no error anywhere. `Api.coach()` falls back to
`list[0]` when the id does not match.

After that, **BUG-01**: the time shown is the time booked plus the coach's timezone offset. A
10 AM session with a Tokyo-based coach displays as 7 PM. The stored record is correct, so it
is a display bug, but nothing on screen hints the time is wrong.

## Reproducing anything

Clear state first:

```js
Object.keys(localStorage).filter(k => k.startsWith('aceup.')).forEach(k => localStorage.removeItem(k));
```

One warning from BUG-12: opening a URL with a malformed seed (`?seed=abc`) switches you to
build 1000 **and overwrites the stored seed**. If the footer stops saying 2417, reopen
`index.html?seed=2417`.

## Notes

The `smoke.cy.js` spec that shipped with the starter is gone. Its two checks are covered by
`directory.cy.js` and the booking specs.

`retries: 0` is untouched, as intended.

One thing worth flagging about the repo rather than the app: the fork includes
`qa/homework-evaluation/` and `qa/PLAN.md`, which look like internal grading material. I have
not opened them. Mentioning it in case that was not meant to ship with the candidate bundle.
