/// <reference types="cypress" />

import { resetState } from '../support/app';

// #typing is always in the DOM and toggles a `show` class, so these wait on
// visibility rather than existence.
const replyLanded = () => cy.get('[data-testid="typing"]').should('not.be.visible');

describe('chatting with Ally', () => {
  beforeEach(() => {
    resetState();
    cy.visitApp('/chat.html');
    cy.get('[data-testid="chat-input"]').should('be.enabled');
  });

  it('gets a reply and clears the box', () => {
    cy.get('[data-testid="chat-input"]').type('How do I delegate better?');
    cy.get('[data-testid="chat-send"]').click();

    cy.get('[data-testid="bubble-user"]').should('contain', 'How do I delegate better?');
    replyLanded();

    cy.get('[data-testid="bubble-ally"]').should('have.length.at.least', 2);
    cy.get('[data-testid="chat-input"]').should('have.value', '');
  });

  it('ignores an empty message', () => {
    cy.get('[data-testid="bubble-user"]').should('not.exist');
    cy.get('[data-testid="chat-send"]').click();

    // Give it a beat by waiting on something real, then confirm nothing was sent.
    cy.get('[data-testid="chat-input"]').should('be.enabled');
    cy.get('[data-testid="bubble-user"]').should('not.exist');
  });

  it('locks the input while it is waiting on a reply', () => {
    cy.get('[data-testid="chat-input"]').type('Something to think about');
    cy.get('[data-testid="chat-send"]').click();

    cy.get('[data-testid="chat-input"]').should('be.disabled');
    replyLanded();
    cy.get('[data-testid="chat-input"]').should('be.enabled');
  });
});
