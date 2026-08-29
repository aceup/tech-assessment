/// <reference types="cypress" />

import {
  resetState,
  storedState,
  seedState,
  openBooking,
  pickHour,
  confirmBooking
} from '../support/app';

// These assert what the app *should* do, so they fail on this build. That is
// the point: they go green the day each bug is fixed and catch it coming back.
// Full write-ups in BUG_REPORT.md and findings/.
describe('known defects', () => {
  beforeEach(resetState);

  it('BUG-01: shows the hour that was booked, not one shifted by the timezone', () => {
    openBooking('c1');
    pickHour(17);
    confirmBooking();

    cy.visitApp('/sessions.html');
    cy.get('[data-testid="session-when"]').should('contain', '5:00 PM');
  });

  it('BUG-01: the dashboard agrees with what was stored', () => {
    openBooking('c5');
    pickHour(10);
    confirmBooking();

    cy.visitApp('/index.html');
    cy.get('[data-testid="next-session-when"]').should('contain', '10:00 AM');
  });

  it('BUG-02: finds an accented name typed without the accent', () => {
    cy.visitApp('/coaches.html');
    cy.get('[data-testid="coach-card"]').should('exist');

    cy.get('[data-testid="filter-search"]').type('Sofia');
    cy.get('[data-testid="result-count"]').should('contain', '1');
    cy.get('[data-testid="coach-name"]').should('have.text', 'Sofía Ramírez');
  });

  it('BUG-03: paging keeps the filter applied', () => {
    cy.visitApp('/coaches.html');
    cy.get('[data-testid="coach-card"]').should('exist');

    cy.get('[data-testid="filter-search"]').type('Sofía');
    cy.get('[data-testid="result-count"]').should('contain', '1');

    // One result means one page, so Next has nothing to go to.
    cy.get('[data-testid="page-label"]').should('contain', 'Page 1 of 1');
    cy.get('#next').should('be.disabled');
  });

  it('BUG-04: counts one result as "1 coach"', () => {
    cy.visitApp('/coaches.html');
    cy.get('[data-testid="coach-card"]').should('exist');

    cy.get('[data-testid="filter-search"]').type('Marta');
    cy.get('[data-testid="result-count"]').should('contain', '1 coach found');
  });

  it('UX-03: says so when a search matches nobody', () => {
    cy.visitApp('/coaches.html');
    cy.get('[data-testid="coach-card"]').should('exist');

    cy.get('[data-testid="filter-search"]').type('zzzznobodyhasthisname');
    cy.get('[data-testid="result-count"]').should('contain', '0');

    // A blank region looks the same as a failed load or a slow one.
    cy.get('main').should('contain.text', 'No coaches');
  });

  it('BUG-05: says why the booking was refused', () => {
    openBooking('c2');
    cy.get('[data-testid="slot"][data-available="true"]').first().click();
    cy.get('[data-testid="continue"]').click();

    cy.get('[data-testid="guest-email"]').type('not-an-email');
    cy.get('[data-testid="confirm-booking"]').click();

    cy.get('[data-testid="summary"]')
      .parent()
      .should('contain.text', 'email');
  });

  it('BUG-06: cancelling drops the upcoming count to zero', () => {
    openBooking('c1');
    pickHour(14);
    confirmBooking();

    cy.visitApp('/sessions.html');
    cy.get('.cancel').click();
    cy.get('[data-testid="session-status"]').should('contain', 'cancelled');

    cy.visitApp('/index.html');
    cy.get('[data-testid="stat-upcoming"]').should('have.text', '0');
  });

  it('BUG-06: cancelling frees the slot again', () => {
    openBooking('c1');
    pickHour(14);
    confirmBooking();

    cy.visitApp('/sessions.html');
    cy.get('.cancel').click();
    cy.get('[data-testid="session-status"]').should('contain', 'cancelled');

    openBooking('c1');
    cy.get('[data-testid="slot"][data-hour="14"]').should(
      'have.attr',
      'data-available',
      'true'
    );
  });

  it('BUG-07: keeps the whole note', () => {
    const note = 'A '.repeat(140) + 'END';

    openBooking('c3');
    cy.get('[data-testid="slot"][data-available="true"]').first().click();
    cy.get('[data-testid="continue"]').click();
    cy.get('[data-testid="notes"]').invoke('val', note).trigger('input');
    cy.get('[data-testid="confirm-booking"]').click();
    cy.get('[data-testid="confirm-booking"]').should('not.be.visible');

    storedState().then(({ sessions }) => {
      expect(sessions[0].notes).to.eq(note);
    });
  });

  it('BUG-08: a long unbroken note does not push the buttons off screen', () => {
    openBooking('c1');
    pickHour(14);
    cy.get('[data-testid="continue"]').click();
    cy.get('[data-testid="notes"]').invoke('val', 'X'.repeat(280)).trigger('input');
    cy.get('[data-testid="confirm-booking"]').click();
    cy.get('[data-testid="confirm-booking"]').should('not.be.visible');

    cy.visitApp('/sessions.html');
    cy.get('[data-testid="session-row"]').should('exist');

    cy.document().then((doc) => {
      const el = doc.documentElement;
      expect(el.scrollWidth, 'no horizontal overflow').to.be.at.most(el.clientWidth);
    });
    cy.get('.cancel').should('be.visible');
  });

  it('BUG-09: refuses a coach id that does not exist', () => {
    cy.visitApp('/booking.html', { coach: 'NOPE' });
    cy.get('[data-testid="slot"]').should('exist');

    cy.get('[data-testid="slot"][data-available="true"]').first().click();
    cy.get('[data-testid="continue"]').click();
    cy.get('[data-testid="confirm-booking"]').click();
    cy.get('[data-testid="confirm-booking"]').should('not.be.visible');

    // An id nobody has should not produce a booking at all. Today it silently
    // falls back to whichever coach happens to be first in the list, so you
    // end up booked with someone you never picked.
    storedState().then(({ sessions }) => {
      expect(sessions, 'no booking for an unknown coach').to.have.length(0);
    });
  });

  it('BUG-10: Regenerate replaces the reply instead of repeating the question', () => {
    cy.visitApp('/chat.html');
    cy.get('[data-testid="chat-input"]').should('be.enabled');

    cy.get('[data-testid="chat-input"]').type('How do I delegate better?');
    cy.get('[data-testid="chat-send"]').click();
    cy.get('[data-testid="typing"]').should('not.be.visible');

    cy.contains('button', 'Regenerate').click();
    cy.get('[data-testid="typing"]').should('not.be.visible');

    cy.get('[data-testid="bubble-user"]').should('have.length', 1);
  });

  it('BUG-11: a past session is not counted as upcoming', () => {
    cy.visitApp('/index.html');

    seedState({
      sessions: [
        {
          id: 'PAST',
          coachId: 'c1',
          coachName: 'Marta Oliveira',
          tzOffset: -3,
          tzLabel: 'America/Sao_Paulo',
          date: '2020-01-01',
          hour: 10,
          startsAt: '2020-01-01T10:00:00Z',
          duration: 60,
          notes: '',
          guestEmail: '',
          status: 'confirmed'
        }
      ],
      blocked: [],
      counters: { book: 1 },
      cachedUpcoming: 1
    });

    cy.visitApp('/index.html');
    cy.get('[data-testid="stat-upcoming"]').should('have.text', '0');
  });

  it('BUG-12: a bad seed does not silently switch the build', () => {
    cy.visit('/coaches.html?seed=abc');
    cy.get('[data-testid="coach-card"]').should('exist');

    cy.window().then((win) => {
      expect(win.localStorage.getItem('aceup.seed')).to.not.eq('1000');
    });
  });
});
