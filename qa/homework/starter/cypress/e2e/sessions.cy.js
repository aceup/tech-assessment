/// <reference types="cypress" />

import {
  resetState,
  storedState,
  openBooking,
  pickHour,
  confirmBooking
} from '../support/app';

// Each test books its own session rather than sharing one, so they don't
// depend on each other or on the order they run in.
function bookOne(coach = 'c1', hour = 14) {
  openBooking(coach);
  pickHour(hour);
  confirmBooking();
  cy.visitApp('/sessions.html');
  cy.get('[data-testid="session-row"]').should('have.length', 1);
}

describe('managing a booked session', () => {
  beforeEach(resetState);

  it('cancels a session', () => {
    bookOne();

    cy.get('.cancel').click();
    cy.get('[data-testid="session-status"]').should('contain', 'cancelled');

    storedState().then(({ sessions }) => {
      expect(sessions[0].status).to.eq('cancelled');
    });
  });

  it('drops the reschedule and cancel buttons once cancelled', () => {
    bookOne();

    cy.get('.cancel').click();
    cy.get('[data-testid="session-status"]').should('contain', 'cancelled');
    cy.get('.cancel').should('not.exist');
    cy.get('.resched').should('not.exist');
  });

  it('moves a session to a new hour', () => {
    bookOne('c1', 14);

    cy.get('.resched').click();

    // Which hours the picker offers depends on the seed, so take the first
    // one it gives us instead of naming an hour that may not be there.
    cy.get('[data-testid="resched-hour"] option')
      .first()
      .invoke('val')
      .then((newHour) => {
        cy.get('[data-testid="resched-hour"]').select(newHour);
        cy.get('[data-testid="resched-save"]').click();
        cy.get('[data-testid="resched-save"]').should('not.be.visible');

        storedState().then(({ sessions, blocked }) => {
          expect(sessions[0].hour).to.eq(Number(newHour));
          // The old slot has to come back or the coach quietly loses the hour.
          expect(blocked).to.not.include('c1|' + sessions[0].date + '|14');
          expect(blocked).to.include('c1|' + sessions[0].date + '|' + newHour);
        });
      });
  });

  it('does not offer an hour that is already taken', () => {
    openBooking('c1');
    pickHour(14);
    confirmBooking();

    cy.visitApp('/sessions.html');
    cy.get('[data-testid="session-row"]').should('have.length', 1);
    cy.get('.resched').click();

    cy.get('[data-testid="resched-hour"] option').then((options) => {
      const hours = [...options].map((o) => o.value);
      expect(hours, 'the hour this session already holds').to.not.include('14');
    });
  });
});
