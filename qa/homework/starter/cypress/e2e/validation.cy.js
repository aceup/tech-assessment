/// <reference types="cypress" />

import {
  resetState,
  storedState,
  openBooking,
  pickAnyFreeHour,
  seedState
} from '../support/app';

describe('validation and edges', () => {
  beforeEach(resetState);

  it('does not book when the guest email is malformed', () => {
    openBooking('c2');
    pickAnyFreeHour();
    cy.get('[data-testid="continue"]').click();

    cy.get('[data-testid="guest-email"]').type('not-an-email');
    cy.get('[data-testid="confirm-booking"]').click();

    // The booking must not go through. Whether the user is told about it is
    // BUG-05; this test only covers the data side.
    storedState().then(({ sessions }) => {
      expect(sessions).to.have.length(0);
    });
  });

  it('books once the email is fixed', () => {
    openBooking('c2');
    pickAnyFreeHour();
    cy.get('[data-testid="continue"]').click();

    cy.get('[data-testid="guest-email"]').type('not-an-email');
    cy.get('[data-testid="confirm-booking"]').click();

    cy.get('[data-testid="guest-email"]').clear().type('guest@company.com');
    cy.get('[data-testid="confirm-booking"]').click();
    cy.get('[data-testid="confirm-booking"]').should('not.be.visible');

    storedState().then(({ sessions }) => {
      expect(sessions).to.have.length(1);
      expect(sessions[0].guestEmail).to.eq('guest@company.com');
    });
  });

  it('returns nothing when the search matches nobody', () => {
    cy.visitApp('/coaches.html');
    cy.get('[data-testid="coach-card"]').should('exist');

    cy.get('[data-testid="filter-search"]').type('zzzznobodyhasthisname');
    cy.get('[data-testid="result-count"]').should('contain', '0');
    cy.get('[data-testid="coach-card"]').should('not.exist');
    // Whether it *tells* the user is UX-03, covered in known-defects.
  });

  it('keeps the last slot of the day bookable', () => {
    openBooking('c1');
    cy.get('[data-testid="slot"][data-available="true"]')
      .last()
      .then(($slot) => {
        const hour = Number($slot.attr('data-hour'));
        cy.wrap($slot).click();
        cy.get('[data-testid="continue"]').click();
        cy.get('[data-testid="confirm-booking"]').click();
        cy.get('[data-testid="confirm-booking"]').should('not.be.visible');

        storedState().then(({ sessions }) => {
          expect(sessions[0].hour).to.eq(hour);
        });
      });
  });

  it('does not fall over on corrupt local state', () => {
    cy.visitApp('/sessions.html');
    cy.window().then((win) => {
      win.localStorage.setItem(`aceup.state.${Cypress.env('seed')}`, 'not json {{{');
    });
    cy.visitApp('/sessions.html');

    cy.get('[data-testid="session-list"]').should('be.visible');
    cy.get('[data-testid="session-row"]').should('not.exist');
  });
});
