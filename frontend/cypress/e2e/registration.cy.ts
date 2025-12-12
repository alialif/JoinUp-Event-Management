describe('Event Registration Flow', () => {
  beforeEach(() => {
    cy.login('participant1@bootcamp.com', 'participant123');
    cy.visit('/events');
  });

  it('should display list of events', () => {
    cy.get('.events-table').should('exist');
    cy.contains('AI Bootcamp Sherbrooke 2025').should('be.visible');
  });

  it('should navigate to event detail', () => {
    cy.get('.events-table').contains('View').first().click();
    cy.url().should('include', '/events/');
    cy.contains('Event Detail').should('be.visible');
  });

  it('should register for an event from detail page', () => {
    cy.get('.events-table').contains('View').first().click();
    cy.wait(500);
    cy.get('button').contains('Register').click();
    
    // Should show success feedback
    cy.contains('Registration successful', { timeout: 5000 }).should('be.visible');
    cy.get('button[disabled]').contains('You are already registered').should('be.visible');
  });

  it('should show capacity information', () => {
    cy.get('.events-table').should('exist');
    cy.contains('Capacity').should('be.visible');
    // Check that capacity format is displayed (e.g., 1/50)
    cy.get('.events-table td').should('contain', '/');
  });
});
