# BUG-02: searching a name without its accent finds nothing

> **Seed:** `2417` · Chrome 141, macOS 15 (Darwin 25.6.0) · viewport 1400x900 unless the
> finding says otherwise · app served over HTTP at `http://localhost:4173` · 28 Aug 2026
>
> Clear state before reproducing:
> ```js
> Object.keys(localStorage).filter(k => k.startsWith('aceup.')).forEach(k => localStorage.removeItem(k));
> ```
> Check the footer says **build 2417** before you start.

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

## Screenshots

![BUG-02](01_no-accent-zero-results.png)

*`01_no-accent-zero-results.png`*

![BUG-02](02_with-accent-found.png)

*`02_with-accent-found.png`*
