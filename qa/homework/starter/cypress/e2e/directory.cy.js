/// <reference types="cypress" />

import { resetState } from '../support/app';

// The directory is read-only, so these don't need a clean slate as much as
// the booking specs do. Resetting anyway keeps them independent.
describe('finding a coach', () => {
  beforeEach(() => {
    resetState();
    cy.visitApp('/coaches.html');
    cy.get('[data-testid="coach-card"]').should('exist');
  });

  it('filters by specialty', () => {
    cy.get('[data-testid="filter-specialty"]').select('Leadership');
    cy.get('[data-testid="result-count"]').should('contain', '3');

    // Every card on screen should actually be a Leadership coach, not just
    // three cards of any kind.
    cy.get('[data-testid="coach-card"]').should('have.length', 3);
    cy.get('[data-testid="coach-card"]').each((card) => {
      cy.wrap(card).should('contain', 'Leadership');
    });
  });

  it('narrows further when a language is added', () => {
    cy.get('[data-testid="filter-specialty"]').select('Leadership');
    cy.get('[data-testid="filter-language"]').select('Spanish');

    cy.get('[data-testid="result-count"]').should('contain', '2');
    cy.get('[data-testid="coach-name"]').then((names) => {
      const found = [...names].map((n) => n.textContent.trim());
      expect(found).to.deep.eq(['Sofía Ramírez', 'Tomás Herrera']);
    });
  });

  it('searches by name', () => {
    cy.get('[data-testid="filter-search"]').type('Marta');
    cy.get('[data-testid="result-count"]').should('contain', '1');
    cy.get('[data-testid="coach-name"]').should('have.text', 'Marta Oliveira');
  });

  it('sorts by rating, highest first', () => {
    cy.get('#sort').select('rating');

    cy.get('[data-testid="coach-card"]').then((cards) => {
      const ratings = [...cards].map((c) =>
        Number(c.innerText.match(/([\d.]+) ★/)[1])
      );
      const descending = [...ratings].sort((a, b) => b - a);
      expect(ratings).to.deep.eq(descending);
    });
  });

  it('pages through the whole directory without losing anyone', () => {
    const seen = [];

    const collect = () =>
      cy.get('[data-testid="coach-name"]').then((names) => {
        seen.push(...[...names].map((n) => n.textContent.trim()));
      });

    collect();
    cy.get('#next').click();
    cy.get('[data-testid="page-label"]').should('contain', 'Page 2');
    collect();
    cy.get('#next').click();
    cy.get('[data-testid="page-label"]').should('contain', 'Page 3');
    collect();

    cy.then(() => {
      expect(seen).to.have.length(12);
      expect(new Set(seen).size, 'no duplicates across pages').to.eq(12);
    });

    cy.get('#next').should('be.disabled');
  });
});
