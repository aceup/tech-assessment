# Test plan

**Seed:** `2417` · Chrome 141, macOS 15 · 28-29 Aug 2026

## What I covered, and what I left out

I spent the first half of the timebox exploring the five flows by hand and the second half
automating. Exploration came first on purpose: I wanted to know where the app actually breaks
before deciding what was worth a test.

In scope: booking end to end, cancel and reschedule, the coach directory (search, filters,
sort, pagination), the chat round trip, and the dashboard counters. That produced 12
functional bugs and 11 usability or accessibility findings.

Out of scope by choice:

- **Performance, load and security.** The brief rules them out. I did note that user text is
  escaped properly in the chat, since I was already rendering untrusted input there.
- **Cross-browser.** Everything is Chrome 141. Nothing I found looks browser-specific, but I
  have not confirmed that.
- **A real screen-reader pass.** My accessibility findings come from the accessibility tree
  and the DOM, so they understate what VoiceOver or NVDA would actually surface. UX-01 and
  UX-02 are solid on their own terms, but a real AT session would find more.

## What I automated and why

Six specs, 36 tests. Twenty-one pass and fifteen fail on purpose.

| Spec | Covers |
|---|---|
| `booking.cy.js` | booking end to end, notes and duration, double-booking, surviving a reload |
| `sessions.cy.js` | cancel, reschedule, slot bookkeeping |
| `directory.cy.js` | filters, combined filters, search, sort, paging the full list |
| `chat.cy.js` | send and reply, empty message, input locking |
| `validation.cy.js` | bad guest email, no-match search, last slot of the day, corrupt state |
| `known-defects.cy.js` | 15 regression tests, one per bug, asserting correct behaviour |

I automated the things that are cheap to check and expensive to get wrong: whether the right
data gets stored, whether filters return the right coaches, whether a cancelled session stops
counting. These are the checks a human gets bored of repeating and starts skimming.

I left manual the things a test cannot really judge. Whether the 320 px layout is *usable*
rather than merely non-overflowing. Whether a blank results area reads as "nothing found" or
as "broken". Whether the copy makes sense. I did automate the measurable half of two of them:
BUG-08 asserts `scrollWidth <= clientWidth`, and UX-03 asserts that some empty-state text
exists. A number can catch the regression even when it cannot judge the experience.

The regression tests assert what the app **should** do, so they fail today. They are in a
`describe('known defects')` block, each named with its bug id. Nothing is skipped, and none of
them assert the buggy behaviour, because a test that codifies a bug protects the bug.

## Keeping it deterministic

Three things could have made this suite flaky, and each needed handling.

**State.** Booked sessions live in `localStorage` under `aceup.state.<seed>`, so they survive
page loads and would leak between tests. Every spec clears storage in `beforeEach` and each
test books whatever it needs. No test depends on another, and they pass in any order.

**Latency.** The fake API adds 200 to 900 ms to every request. There is no `cy.wait(<ms>)`
anywhere in the suite. Instead each step waits on a state change that means the work is done:
a slot existing before I click it, the confirm button becoming invisible after the modal
closes, the typing indicator hiding after Ally replies.

That second one cost me a round of debugging worth mentioning. `Api.book()` resolves
asynchronously, so reading `localStorage` straight after clicking Confirm gets you the state
from *before* the booking. Four tests failed on that until I made the helper wait for the
modal to close. It is exactly the kind of thing a fixed `cy.wait(1000)` would have papered
over, which is a good argument for the rule.

**Seed-dependent data.** Which hours are free changes with the seed, so tests that named a
specific hour would break on a different build. Where the exact hour does not matter, the
tests take whatever slot is free and assert against that. Where it does matter (BUG-01 needs
a PM hour to show the shift clearly) the hour is named and the seed is stated.

I ran the full suite three times back to back. Same result each time: 21 passing, 15 failing,
no flakes.

## Where the app was hard to test

**Most things have `data-testid`, but not everything.** The sort dropdown and the pager
buttons only have ids (`#sort`, `#prev`, `#next`), and the session action buttons only have
classes (`.resched`, `.cancel`). Those are the selectors I am least happy about, because a
class is a styling hook and someone will rename it during a redesign without thinking about
tests. I would ask for `data-testid` on all of them.

**No way to control the clock.** The app builds its day list from `new Date()` at load time,
so anything time-dependent cannot be tested through the UI. That is why BUG-11 has to seed
`localStorage` directly to get a past session, and why I could not test the "reschedule up to
12 hours before it starts" rule at all: the booking window is 7 days and the earliest slot is
already more than 12 hours out. An injectable clock, or a query parameter that fixes "now",
would make both testable.

**Success and failure look the same from the outside.** When a booking is refused, the modal
just stays open. There is no error element, no state change, nothing to assert on. My test for
the invalid email has to check `localStorage` to prove the booking did not happen. A rendered
error message would make that a one-line assertion, and would also fix BUG-05.

**Slot availability is baked into the seed, not controllable.** To test a fully booked day I
would have to book every slot first. A way to set up state through an API, rather than through
the UI, would make that kind of test cheap.

## The three areas I would regression-test every release

**1. Booking: the time that gets stored versus the time that gets shown.** This is where the
worst bug lives (BUG-01) and where a defect costs the most: a member who shows up at the wrong
hour has wasted a coach's paid time and their own. It is also the flow with the most moving
parts, timezones, formatting, storage, so it has the most room to break. Anything that touches
date handling should re-run these.

**2. Session state after cancel and reschedule.** Two bugs already live here (BUG-06,
BUG-11), and the failure mode is quiet. Nothing crashes, the numbers are just wrong, and a
slot silently stops being bookable. Nobody notices until a coach asks why their calendar is
full when it should not be. Quiet bugs need automated coverage more than loud ones do,
because loud ones get reported on day one.

**3. The coach directory's filters and search.** Not because it is fragile but because it is
the entry point. Every booking starts by finding someone, and BUG-02 and BUG-03 both make
coaches invisible: one to anyone typing without accents, the other to anyone who clicks Next.
A member who cannot find a coach does not file a bug, they just stop using the product.

I would not put the chat in the top three. It is the most self-contained flow, the failures I
found there are cosmetic next to the others, and a wrong answer from Ally does not cost
anybody a booking.

## What I would do next

In rough order:

- **Test the 12-hour reschedule rule.** It is a promise the UI makes to users and it is
  completely uncovered. Needs the clock to be injectable, so it is a conversation with
  engineering before it is a test.
- **A real screen-reader pass.** UX-01 says booking is impossible by keyboard. I would want
  that confirmed by someone driving VoiceOver, not inferred from the DOM.
- **Contrast and 200% zoom checks**, to finish the accessibility picture.
- **Two-tab behaviour** (UX-11) and what happens when `localStorage` is full or disabled.
  Both are edge cases, both are cheap to check once, and neither has been looked at.
- **Wire the suite into CI** so the known-defects block turns green bug by bug as fixes land.
  That block is the most useful artefact here: it is a live checklist of what is still broken.
