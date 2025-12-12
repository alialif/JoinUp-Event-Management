describe('Certificate Generation', () => {
  beforeEach(() => {
    cy.login('staff@bootcamp.com', 'staff123');
  });

  it('should access attendance and certificates from event detail (staff only)', () => {
    cy.visit('/events');
    cy.get('.events-table').contains('View').first().click();
    
    // Staff should see management links
    cy.contains('Attendance').should('be.visible');
    cy.contains('Certificates').should('be.visible');
  });

  it('should mark attendance for event', () => {
    cy.visit('/events');
    cy.get('.events-table').contains('View').first().click();
    cy.wait(500);
    cy.contains('Attendance').click();
    
    cy.url().should('include', '/attendance/');
    cy.get('.att-table').should('exist');
    // Mark first participant if available
    cy.get('.att-table button').first().click();
  });

  it('should issue certificate for registered participant', () => {
    cy.visit('/events');
    cy.get('.events-table').contains('View').first().click();
    cy.wait(500);
    cy.contains('Certificates').click();
    
    cy.url().should('include', '/certificates/');
    cy.get('.cert-table').should('exist');
    // Issue certificate for first registration if not already issued
    cy.get('.cert-table button:not([disabled])').first().click();
    
    // Should show PDF link after issuance
    cy.contains('PDF', { timeout: 5000 }).should('be.visible');
  });
});
