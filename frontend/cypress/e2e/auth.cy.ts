describe('Authentication Flow', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('should redirect to login when not authenticated', () => {
    cy.url().should('include', '/login');
  });

  it('should login with valid credentials and redirect to events', () => {
    cy.visit('/login');
    cy.get('input[formControlName="email"]').type('admin@bootcamp.com');
    cy.get('input[formControlName="password"]').type('admin123');
    cy.get('button[type="submit"]').click();
    
    // Should redirect to events page
    cy.url().should('include', '/events');
    cy.contains('Events').should('be.visible');
  });

  it('should show error with invalid credentials', () => {
    cy.visit('/login');
    cy.get('input[formControlName="email"]').type('wrong@email.com');
    cy.get('input[formControlName="password"]').type('wrongpass');
    cy.get('button[type="submit"]').click();
    
    cy.contains('Invalid').should('be.visible');
  });

  it('should logout successfully', () => {
    cy.login('admin@bootcamp.com', 'admin123');
    cy.visit('/events');
    cy.contains('Logout').click();
    cy.url().should('include', '/login');
  });
});
