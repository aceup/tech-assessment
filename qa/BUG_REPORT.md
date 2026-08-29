# Bug report

**Seed:** `2417`
**Browser:** Chrome 141, macOS 15 (Darwin 25.6.0)
**Viewport:** 1400x900 unless a bug says otherwise
**App:** served over HTTP at `http://localhost:4173`
**Tested:** 28 Aug 2026

Before each repro I clear local state and check the footer says **build 2417**:

```js
Object.keys(localStorage).filter(k => k.startsWith('aceup.')).forEach(k => localStorage.removeItem(k));
```

For what I checked and found working, what I chose not to report, and what I did not get to,
see [`SCOPE_COVERAGE.md`](homework/findings/SCOPE_COVERAGE.md). Three smaller findings live
in [`observations/`](homework/findings/observations/README.md).

Every bug below also has its own folder under [`findings/`](homework/findings/README.md) with the
annotated screenshots next to it.

---

## At a glance

Nine defects, grouped by severity. Impact is what it costs the user if this ships; priority is
how soon I would fix it, which is not always the same thing.

| ID | What breaks | Severity | Priority |
|---|---|---|---|
| **BUG-01** | the time you book is not the time you see | Critical | P0 |
| **BUG-09** | an unknown coach id books someone else entirely | Critical | P0 |
| **BUG-03** | page 2 throws away the search filter | High | P1 |
| **BUG-05** | an invalid guest email blocks the booking and says nothing | High | P1 |
| **BUG-06** | cancelling leaves the dashboard count and the coach's slot stale | High | P1 |
| **BUG-08** | one long word in the notes pushes Cancel off the screen | High | P1 |
| **BUG-11** | past sessions are counted and announced as upcoming | High | P1 |
| **BUG-02** | searching a name without its accent finds nothing | Medium | P1 |
| **BUG-07** | session notes are cut at 280 characters without saying so | Medium | P2 |

Three smaller things did not make this list. They reproduce, but the impact is cosmetic or
needs a malformed URL to trigger, so they are in
[`observations/`](homework/findings/observations/README.md) rather than padding the bug count.

# Critical severity

Both of these hand the user a booking that is not the one they made. No error, nothing on screen to catch it.

---

## BUG-01: the time you book is not the time you see

| | |
|---|---|
| **Severity** | Critical |
| **Priority** | P0 |
| **Where I think it lives** | Date formatting in the session renderer (dashboard and My sessions) |

**Why P0.** The stored record is right, so this is a display fix rather than a data
migration. But until it ships, members are showing up at the wrong hour, or missing sessions
entirely. There is no workaround, and nothing on screen hints the time might be wrong.

**Preconditions:** clean state, seed 2417.

**Steps**
1. Open `http://localhost:4173/booking.html?coach=c1&seed=2417` (Marta Oliveira).
2. Leave the pre-selected day, **Sat 29 (08/29)**.
3. Click the **5:00 PM** slot.
4. Click **Continue**. The modal correctly says `Time 5:00 PM`.
5. Click **Confirm booking**.
6. Go to **My sessions**.

**Expected**
The session shows as `29/08/2026 · 5:00 PM`. That is what I picked, and what the modal showed
one step earlier.

**Actual**
It shows as `29/08/2026 · 2:00 PM`. Three hours early. The dashboard "Next session" card
shows the same wrong time.

The stored record is correct:

```json
{"coachName":"Marta Oliveira","tzOffset":-3,"tzLabel":"America/Sao_Paulo",
 "date":"2026-08-29","hour":17,"startsAt":"2026-08-29T17:00:00Z","status":"confirmed"}
```

Nothing in the console.

**The shift is the coach's timezone offset.** I checked four coaches. The displayed time is
the booked time *plus* `tzOffset`, so coaches east of UTC push the session later in the day
and coaches west push it earlier:

| Coach | Timezone | Offset | Booked | Shown | Off by |
|---|---|---|---|---|---|
| Yuki Tanaka | Asia/Tokyo | +9 | 10:00 AM | 7:00 PM | +9 h |
| Priya Raman | Asia/Kolkata | +5 | 8:00 AM | 1:00 PM | +5 h |
| Marta Oliveira | America/Sao_Paulo | −3 | 5:00 PM | 2:00 PM | −3 h |
| Daniel Whitfield | America/New_York | −5 | 11:00 AM | 6:00 AM | −5 h |
| Daniel Whitfield | America/New_York | −5 | 3:00 PM (rescheduled) | 10:00 AM | −5 h |

The Tokyo case is the ugliest: a 10 AM session shows up as 7 PM, moving it from morning to
evening. Reschedule does the same thing, so this is not limited to the booking path.

`startsAt` is written with a `Z` suffix even though the hour is local wall-clock time. Any
renderer that parses that as UTC and then applies `tzOffset` subtracts the offset twice.
Booking, reschedule and the dashboard are all affected, which points at one shared formatting
helper rather than three separate bugs.

---

## BUG-09: an unknown coach id books someone else entirely

| | |
|---|---|
| **Severity** | Critical |
| **Priority** | P0 |
| **Where I think it lives** | Booking page. The `coach` query parameter is not validated, and the header and the submit handler resolve it to two different coaches |

**Why P0.** This is the one that worries me most. You read one coach's name on screen,
confirm, and end up booked with somebody else. No error, no console warning, nothing on the
confirmation screen that would let you catch it. Stale bookmarks, mistyped links, or any
future change to coach ids all land here.

**Preconditions:** clean state, seed 2417.

**Steps**
1. Open `http://localhost:4173/booking.html?coach=NOEXISTE&seed=2417`.
2. Look at the page header.
3. Pick any free slot, click **Continue**, then **Confirm booking**.
4. Check `aceup.state.2417`, or open **My sessions**.

**Expected**
An unknown coach id is rejected. A "coach not found" message, or a redirect to the directory.
Booking should not proceed against a coach that could not be resolved.

**Actual**
The page renders normally and shows **Marta Oliveira** in the header and in the confirmation
modal. The booking goes through, and the stored session says `"coachId":"c12"`,
`"coachName":"Nadia Haddad"`. A third coach, matching neither the URL nor anything on screen.
Nothing in the console at any point.

With a valid id (`coach=c3`) the header, the modal and the stored record all agree on Ana
Beltrán, so this only happens on the unresolved-id path.

# High severity

None of these lose a booking outright, but each one either blocks an action or makes the app contradict itself.

---

## BUG-03: page 2 throws away the search filter

| | |
|---|---|
| **Severity** | High |
| **Priority** | P1 |
| **Where I think it lives** | Directory pagination. The page count comes from the unfiltered list, and the page-change handler re-renders from the full list too |

**Why High.** I opened this as a page-count bug and it turned out to be worse. Page 2 serves
coaches that contradict the filter still sitting in the search box. The user cannot tell
which screen to believe, and someone who lands on page 2 will reasonably conclude search is
broken.

**Preconditions:** clean state, seed 2417.

**Steps**
1. Open `http://localhost:4173/coaches.html?seed=2417`.
2. Search for `Sofía` (with the accent). One result: Sofía Ramírez.
3. Look at the pager. It says `Page 1 of 3` and **Next** is enabled.
4. Click **Next**.

**Expected**
One match means `Page 1 of 1` and a disabled **Next**. Pagination should run on the filtered
set.

**Actual**
The pager says `Page 1 of 3`. Clicking **Next** lands on `Page 2 of 3` showing **Claire
Dubois, Daniel Whitfield, Kwame Mensah and Nadia Haddad**, none of whom match `Sofía`, and
Sofía herself is gone. The search box still holds `Sofía` and the counter still says `1
coaches found`. The filter reaches the count but not the page.

---

## BUG-05: an invalid guest email blocks the booking and says nothing

| | |
|---|---|
| **Severity** | High |
| **Priority** | P1 |
| **Where I think it lives** | Guest-email validation in the confirmation modal. The error container renders but never gets filled |

**Why High.** Rejecting the address is correct. The problem is the silence. The button looks
dead, which from the user's side is the same as a broken app. They will click again, then
leave.

**Preconditions:** clean state, seed 2417.

**Steps**
1. Open `http://localhost:4173/booking.html?coach=c2&seed=2417` (Daniel Whitfield).
2. Keep **Sat 29**, click the **11:00 AM** slot, click **Continue**.
3. Type `esto-no-es-un-email` into **Invite a guest (optional)**.
4. Click **Confirm booking**.

**Expected**
Either the booking is rejected with a clear message next to the field, something like "Enter
a valid email address, or leave this blank", or the value is accepted. Rejecting without
telling anyone is not an option.

**Actual**
Nothing visible happens. The modal stays open, no message appears, no console error. The
booking is not created (`sessions` stays empty in `aceup.state.2417`) but `counters.book`
still ticks up to 1, so the attempt is half-processed.

Two things I found while digging. There is an empty `.hint` element inside the modal, 420 px
wide and 0 px tall, exactly where the message belongs. The container is there and never gets
text. And the field is `<input type="email">`, so the browser already knows the value is bad:
`checkValidity()` returns `false`. The native validation is available and simply is not being
surfaced.

Clearing the field, or entering `guest@company.com`, lets the same booking through straight
away. So the guest email is the only thing causing it.

---

## BUG-06: cancelling leaves the dashboard count and the coach's slot stale

| | |
|---|---|
| **Severity** | High |
| **Priority** | P1 |
| **Where I think it lives** | Cancel handler. `cachedUpcoming` is not recomputed and the `blocked[]` entry is not released |

**Why High.** Two visible problems from one cause, and the second is worse than it looks. A
cancelled slot stays unbookable, so the coach quietly loses availability that nobody can get
back through the UI. The dashboard contradicting itself also makes every other number on that
screen hard to trust.

**Preconditions:** clean state, seed 2417, one confirmed upcoming session.

**Steps**
1. Book a session, for example Daniel Whitfield, Sat 29, 3:00 PM.
2. Go to **My sessions**, click **Cancel**. The row flips to `CANCELLED` and the "Session
   cancelled" toast appears, both correct.
3. Go to **Dashboard**.
4. Go back to `booking.html?coach=c2&seed=2417` and look at the slot you just cancelled.

**Expected**
The dashboard shows `UPCOMING SESSIONS: 0`, matching the "no sessions booked" card next to
it. The cancelled slot is bookable again.

**Actual**
The dashboard shows `UPCOMING SESSIONS: 1` right beside a card that reads "No sessions booked
yet. Pick a coach to get started." The same screen contradicts itself.

In `aceup.state.2417`, `cachedUpcoming` is still `1` even though the only session is
`"status":"cancelled"`, and `blocked` still holds `"c2|2026-08-29|15"`, so that time cannot
be re-booked.

Worth knowing: reschedule handles `blocked[]` properly, releasing the old slot and taking the
new one. So this is an omission in the cancel handler, not a design limitation.

---

## BUG-08: one long word in the notes pushes Cancel off the screen

| | |
|---|---|
| **Severity** | High |
| **Priority** | P1 |
| **Where I think it lives** | Session card CSS. The notes element uses `overflow-wrap: normal` and `word-break: normal` |

**Why High.** This is not just an ugly overflow. It puts **Reschedule** and **Cancel** out of
reach, so the member loses control of a booking they have already made. Ordinary pasted
content triggers it, and they cannot fix the note afterwards because the buttons that would
let them are the ones off screen.

**Preconditions:** clean state, seed 2417.

**Steps**
1. Book a session and put a string of more than about 60 characters with no spaces in the
   notes. A pasted token or ID does it. 280 × `X` reproduces it every time.
2. Go to **My sessions**.

**Expected**
The note wraps inside the card, the card keeps its width, and both buttons stay visible.

**Actual**
The note renders as one unwrapped line 2 280 px wide. The document grows to 2 759 px against
a 1 400 px viewport, so 1 359 px of horizontal overflow, and **Cancel** ends up at
`x = 2 701`, completely outside the visible area. You cannot cancel or reschedule that
session without finding the horizontal scrollbar first.

Computed style on the notes element is `overflow-wrap: normal; word-break: normal`.

One thing to know before writing a test for this: the notes column is about 485 px wide at
roughly 8 px per character, so anything past ~60 unbroken characters overflows. Normal prose
wraps fine, and strings with `-` or `_` break at those characters. You need a genuinely
unbroken run to reproduce it.

---

## BUG-11: past sessions are counted and announced as upcoming

| | |
|---|---|
| **Severity** | High |
| **Priority** | P1 |
| **Where I think it lives** | Session classification. Nothing compares against the current date, on the dashboard or in the list |

**Why High.** The dashboard exists to answer "what's next", and it answers wrong as soon as
one past session exists. The app has no way to complete or archive a session, so every
booking eventually becomes a past one. That means this gets worse with use: the first session
a member ever booked keeps being announced as their next.

**Preconditions:** clean state, seed 2417, plus a session in the past. The booking UI only
offers the next 7 days, so seed the state directly:

```js
localStorage.setItem('aceup.state.2417', JSON.stringify({
  sessions: [
    {id:'P1', coachId:'c1', coachName:'Marta Oliveira', tzOffset:-3, tzLabel:'America/Sao_Paulo',
     date:'2020-01-01', hour:10, startsAt:'2020-01-01T10:00:00Z', duration:60,
     notes:'', guestEmail:'', status:'confirmed'},
    {id:'F1', coachId:'c2', coachName:'Daniel Whitfield', tzOffset:-5, tzLabel:'America/New_York',
     date:'2026-09-02', hour:14, startsAt:'2026-09-02T14:00:00Z', duration:60,
     notes:'', guestEmail:'', status:'confirmed'}
  ], blocked: [], counters: {book:2}, cachedUpcoming: 2
}));
```

**Steps**
1. Run that in the console, then open `http://localhost:4173/index.html?seed=2417`.
2. Read **UPCOMING SESSIONS** and the **Next session** card.
3. Open **My sessions**.

**Expected**
`UPCOMING SESSIONS` counts only future sessions, so 1. **Next session** shows 02/09/2026 with
Daniel Whitfield. The 2020 session shows as past, with **Reschedule** and **Cancel** removed.

**Actual**
`UPCOMING SESSIONS` reads 2, counting the 2020 session. **Next session** announces
01/01/2020, so the member never sees their real next appointment. In **My sessions** the 2020
session is still badged `CONFIRMED` and still offers **Reschedule** and **Cancel**, both
acting on something that already happened.

The screen is titled "Upcoming and past coaching sessions", so past sessions were clearly
meant to be handled. There is just no date comparison anywhere. Different cause from BUG-06,
and the two stack: a stale counter plus a wrong "next" makes the whole dashboard unreliable.

# Medium severity

Real defects with a narrower blast radius. Worth fixing, not worth blocking a release.

---

## BUG-02: searching a name without its accent finds nothing

| | |
|---|---|
| **Severity** | Medium |
| **Priority** | P1 |
| **Where I think it lives** | Directory search filter, comparing strings without Unicode normalisation |

**Why P1 rather than P2.** Five of the twelve coaches have accented names, and the product is
aimed at Spanish and Portuguese speakers who mostly type without accents. A member who cannot
find a coach assumes the coach is not there and gives up.

**Preconditions:** clean state, seed 2417.

**Steps**
1. Open `http://localhost:4173/coaches.html?seed=2417`. The list shows `12 coaches found`.
2. Type `Sofia` into **Search**, no accent.

**Expected**
Sofía Ramírez comes back. Accent-insensitive matching is standard for name search.

**Actual**
`0 coaches found`, blank results area. Typing `Sofía` with the accent returns `1 coaches
found` and the right card, so the problem is the diacritic and not the search feature.

---

## BUG-07: session notes are cut at 280 characters without saying so

| | |
|---|---|
| **Severity** | Medium |
| **Priority** | P2 |
| **Where I think it lives** | Booking submit handler. The note is trimmed before storage and the field declares no limit |

**Why Medium and not P1.** Losing data would normally rate higher, but the loss is bounded
and shows up once someone opens the session. What keeps it above cosmetic is that nobody is
told: no `maxlength`, no counter, and the trim happens after confirmation. The first person
to notice is the coach reading a note that stops mid-sentence.

**Preconditions:** clean state, seed 2417.

**Steps**
1. Open `http://localhost:4173/booking.html?coach=c8&seed=2417`.
2. Pick any free slot, click **Continue**.
3. In **What do you want to work on?** paste 333 characters ending in something you will
   recognise. I used `IMPORTANTE: ` + 300 × `a` + ` ESTE FINAL SE PIERDE`.
4. Click **Confirm booking**, then look at `aceup.state.2417`.

**Expected**
Either the whole note is stored, or the field shows its limit while you type.

**Actual**
Exactly 280 characters are stored. The other 53 are dropped, and `ESTE FINAL SE PIERDE` is
gone. The `<textarea>` has no `maxlength` and there is no counter anywhere in the modal, so
nothing warns you before, during or after. A 220-character note survives intact, which puts
the cut at 280.

The notes field is how a member tells their coach what the session is for. Someone who writes
a careful brief loses the end of it, and neither side can tell anything is missing.
