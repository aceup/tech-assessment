/// <reference types="cypress" />

import {
  resetState,
  storedState,
  openBooking,
  pickHour,
  pickAnyFreeHour,
  confirmBooking
} from '../support/app';

describe('booking a session', () => {
  beforeEach(resetState);

  it('stores the session I picked', () => {
    openBooking('c1');
    pickHour(14);
    confirmBooking();

    // The toast is nice but it doesn't prove anything got saved.
    storedState().then((state) => {
      expect(state.sessions).to.have.length(1);
      const [session] = state.sessions;
      expect(session.coachId).to.eq('c1');
      expect(session.hour).to.eq(14);
      expect(session.duration).to.eq(60);
      expect(session.status).to.eq('confirmed');
    });
  });

  it('keeps notes and the 30 minute duration', () => {
    openBooking('c3');
    pickAnyFreeHour();
    cy.get('[data-testid="continue"]').click();

    cy.get('[data-testid="duration"]').select('30');
    cy.get('[data-testid="notes"]').type('Prep for the Q4 review');
    cy.get('[data-testid="confirm-booking"]').click();
    cy.get('[data-testid="confirm-booking"]').should('not.be.visible');

    storedState().then(({ sessions }) => {
      expect(sessions[0].duration).to.eq(30);
      expect(sessions[0].notes).to.eq('Prep for the Q4 review');
    });
  });

  it('will not let the same slot be booked twice', () => {
    openBooking('c1');
    pickHour(14);
    confirmBooking();

    openBooking('c1');
    cy.get('[data-testid="slot"][data-hour="14"]')
      .should('have.attr', 'data-available', 'false')
      .and('have.class', 'taken');
  });

  it('survives a reload', () => {
    openBooking('c1');
    // Which hours are free depends on the seed, so take whatever is going
    // rather than hard-coding one that may be booked on this build.
    pickAnyFreeHour().then((hour) => {
      confirmBooking();
      cy.reload();

      storedState().then(({ sessions }) => {
        expect(sessions).to.have.length(1);
        expect(sessions[0].hour).to.eq(hour);
      });
    });
  });
});
