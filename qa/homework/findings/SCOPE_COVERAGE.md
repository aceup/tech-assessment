# Scope and coverage

**Seed:** `2417` · Chrome 141, macOS 15 · 28 Aug 2026

This sits alongside the individual findings. A test pass is only as trustworthy as its
account of what was actually looked at, so here is what I checked and found working, what I
decided not to report, and what I did not get to.

## Checked and working

Listed so the coverage claim can be audited, and to keep the bug list free of noise.

- **Directory pagination, unfiltered.** 12 unique coaches across 3 pages, nobody duplicated
  or missing. **Next** disabled on the last page, **Prev** disabled on the first.
- **Sorting.** All three orders (Top rated, Most sessions, Name) put all 12 coaches in the
  right sequence across the three pages.
- **Specialty and language filters.** All five specialties and all four languages return
  exactly the right coaches, checked against `app/data/coaches.json`. I also ran six
  specialty × language combinations and each returned the correct intersection.
- **Search behaviour.** Case-insensitive, tolerant of leading and trailing spaces, matches
  partial words, and covers name, title and bio, which matches the "Name or keyword"
  placeholder. Searching `.` returns all 12 because every bio ends in a full stop. That is
  expected, not a defect. Regex metacharacters (`[aeiou]`, `^M`, `a.a`) are treated as
  literal text, so the input is not being evaluated as a pattern.
- **Slot blocking.** A slot that was just booked renders as `taken` with
  `data-available="false"` and cannot be booked twice.
- **Reschedule.** Stores the chosen hour correctly (`hour:15` for 3:00 PM), leaves out hours
  already taken by another session with the same coach that day, releases the original slot
  and blocks the new one. It only inherits the display problem from BUG-01. Worth putting
  next to BUG-06: reschedule maintains `blocked[]` properly, so failing to release the slot
  on cancel is an omission in that one handler rather than something the design forces.
- **Booking confirmation modal.** The summary (coach, date, time) is right. The discrepancy
  only shows up after you confirm.
- **Chat round trip.** The message sends, the input clears, Ally replies, and an empty
  message is correctly refused.
- **Concurrent sends in the chat.** While a reply is pending, the input and send button are
  disabled and a typing indicator shows. Text typed meanwhile stays in the field instead of
  being lost. I originally thought messages were being dropped here; that turned out to be an
  artefact of scripting clicks onto a disabled button, which a real user cannot do.
- **Multiple sessions.** The dashboard picks the genuinely nearest one, and My sessions lists
  them in date order even when they are stored out of order.
- **Corrupt local state.** Setting `aceup.state.2417` to invalid JSON does not break
  anything. The app falls back to the empty state ("Nothing booked yet. Find a coach.") with
  no console error.
- **The 7-day window.** Exactly 7 days are offered, starting the day after today, and every
  weekday label matches its date.
- **Slot availability is deterministic.** The same coach and day always give the same
  availability across reloads and day switches, and different coaches have different
  patterns. Within one coach the pattern does repeat across all 7 days, but the build is
  deliberately deterministic and `app/README.md` promises nothing about day-to-day variation,
  so I am recording that as an observation about how realistic the data feels rather than as
  a defect.
- **User text is escaped.** `<b>` tags and an `<img onerror=…>` payload sent through the chat
  render as literal text. Nothing is injected and no handler fires. Security testing is out
  of scope per the brief; I am noting it only because rendering user text sits right next to
  the notes and chat bugs above.

## Build constraints I chose not to report

`app/README.md` lists these as limitations of the assessment build, so they are not defects:
the artificial 200 to 900 ms latency, only the five listed flows existing, no login (you are
always "Alex Rivera"), and the 7-day booking window.

## Gaps

- The chat input has no `maxlength` and accepts 5 000 characters. It sends in full and the
  layout holds, so I am filing that as a hardening note rather than a bug. Worth flagging
  that the *notes* field with no `maxlength` does cause real damage, in BUG-07 and BUG-08.
- Chat history does not survive a reload. `app/README.md` only promises persistence for
  booked sessions, so I am treating that as a design decision. Still worth confirming with
  product.
- **I could not test the "reschedule up to 12 hours before it starts" rule** that the
  confirmation modal states. The booking window is capped at 7 days and the earliest slots
  are already more than 12 hours out, so reaching the cut-off would mean controlling the
  clock. That leaves an untested constraint on a user-facing promise, and it is the first
  thing I would pick up with more time.
- Not covered: two browser tabs writing to the same `localStorage` key at once, and what
  happens when `localStorage` is full or disabled.
- No screen-reader pass with VoiceOver or NVDA. The accessibility findings come from the
  accessibility tree and the DOM, so they understate what a real AT session would turn up:
  announcement order, and whether the toasts are announced at all.
- No colour-contrast measurement against WCAG 1.4.3, and nothing tested at 200% browser zoom.
- No `prefers-reduced-motion` check on the modal and toast transitions.

## Things that work well

Worth recording, both for balance and because a redesign should keep them:

- Disabled slots are visually distinct and genuinely not clickable.
- Booking, cancelling and chatting all give immediate toast feedback.
- Booked state survives a reload, so an accidental refresh costs nothing.
- An empty chat input is refused rather than sending a blank message.
- Pagination on the unfiltered directory disables **Prev** and **Next** correctly at both
  ends.
