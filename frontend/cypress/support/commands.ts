// ***********************************************
// This example commands.ts shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************

declare namespace Cypress {
  interface Chainable {
    login(email: string, password: string): Chainable<void>;
  }
}

Cypress.Commands.add('login', (email: string, password: string) => {
  cy.request('POST', 'http://localhost:3000/auth/login', { email, password })
    .then((response) => {
      window.localStorage.setItem('token', response.body.accessToken);
    });
});
