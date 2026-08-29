// Small helpers shared by the specs. Kept here rather than in commands.js so
// the starter's own file stays as it shipped.

const seed = () => Cypress.env('seed');

// Booked sessions live in localStorage under aceup.state.<seed>. Every spec
// starts from a blank slate so they can run in any order.
export function resetState() {
  cy.clearLocalStorage();
}

// Reading the state back is the only way to check what was actually stored,
// as opposed to what the screen claims. Several bugs only show up in the gap
// between the two.
export function storedState() {
  return cy.window().then((win) => {
    const raw = win.localStorage.getItem(`aceup.state.${seed()}`);
    return raw ? JSON.parse(raw) : { sessions: [], blocked: [] };
  });
}

export function seedState(state) {
  cy.window().then((win) => {
    win.localStorage.setItem(`aceup.state.${seed()}`, JSON.stringify(state));
  });
}

// The fake API adds 200-900ms to every request, so the slot grid is empty for
// a moment after load. Waiting for a slot to exist is the signal that the
// page is ready; no fixed waits anywhere in the suite.
export function openBooking(coachId) {
  cy.visitApp('/booking.html', { coach: coachId });
  cy.get('[data-testid="slot"]').should('exist');
}

// Picks a specific hour and returns nothing. Use pickAnyFreeHour when the
// exact time doesn't matter.
export function pickHour(hour) {
  cy.get(`[data-testid="slot"][data-hour="${hour}"]`)
    .should('have.attr', 'data-available', 'true')
    .click();
}

export function pickAnyFreeHour() {
  return cy
    .get('[data-testid="slot"][data-available="true"]')
    .first()
    .click()
    .invoke('attr', 'data-hour')
    .then(Number);
}

export function confirmBooking() {
  cy.get('[data-testid="continue"]').click();
  cy.get('[data-testid="confirm-booking"]').should('be.visible').click();
  // Api.book resolves asynchronously and the modal closes on success, so the
  // modal going away is what tells us the write finished. Reading
  // localStorage any earlier gets you the state from before the booking.
  cy.get('[data-testid="confirm-booking"]').should('not.be.visible');
}
