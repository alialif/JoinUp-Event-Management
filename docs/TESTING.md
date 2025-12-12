# Testing Guide

## Overview

The project includes three testing layers:
1. **Backend Unit Tests** (Jest)
2. **Frontend Unit Tests** (Jasmine/Karma)
3. **E2E Tests** (Cypress)

## Backend Testing (Jest)

### Running Tests

```bash
cd backend
npm test              # Run all tests
npm test -- --watch   # Watch mode
npm test -- --coverage # Generate coverage report
```

### Test Structure

```
backend/src/
├── auth/
│   └── auth.service.spec.ts
├── events/
│   └── events.service.spec.ts
├── registrations/
│   └── registrations.service.spec.ts
└── ...
```

### Example Unit Test

```typescript
import { Test, TestingModule } from '@nestjs/testing';
import { EventsService } from './events.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Event } from '../entities/event.entity';

describe('EventsService', () => {
  let service: EventsService;

  const mockRepo = {
    find: jest.fn(),
    save: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EventsService,
        {
          provide: getRepositoryToken(Event),
          useValue: mockRepo,
        },
      ],
    }).compile();

    service = module.get<EventsService>(EventsService);
  });

  it('should return all events', async () => {
    mockRepo.find.mockResolvedValue([]);
    const result = await service.findAll();
    expect(result).toEqual([]);
  });
});
```

### Coverage Thresholds

- Branches: 70%
- Functions: 70%
- Lines: 70%
- Statements: 70%

## Frontend Testing (Jasmine/Karma)

### Running Tests

```bash
cd frontend
npm test              # Run tests in watch mode
npm test -- --no-watch --code-coverage # Single run with coverage
```

### Test Structure

```
frontend/src/app/
├── core/
│   ├── auth.service.spec.ts
│   └── api.service.spec.ts
├── features/
│   └── ...
└── shared/
    └── ...
```

### Example Component Test

```typescript
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LoginComponent } from './login.component';
import { AuthService } from '../../core/auth.service';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let authService: jasmine.SpyObj<AuthService>;

  beforeEach(async () => {
    const authSpy = jasmine.createSpyObj('AuthService', ['login']);

    await TestBed.configureTestingModule({
      imports: [LoginComponent],
      providers: [
        { provide: AuthService, useValue: authSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    authService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
```

## E2E Testing (Cypress)

### Running Tests

```bash
cd frontend
npm run e2e              # Open Cypress UI
npm run e2e:headless     # Run headless (CI mode)
```

### Prerequisites

Both backend and frontend must be running:

```bash
# Terminal 1
cd backend
npm run start:dev

# Terminal 2
cd frontend
npm start
```

### Test Structure

```
frontend/cypress/
├── e2e/
│   ├── auth.cy.ts           # Login/logout flows
│   ├── registration.cy.ts   # Event registration
│   └── certificate.cy.ts    # Certificate issuance/verification
├── fixtures/
│   └── ...                  # Test data
└── support/
    ├── commands.ts          # Custom commands (e.g., cy.login())
    └── e2e.ts               # Global config
```

### Example E2E Test

```typescript
describe('Registration Flow', () => {
  beforeEach(() => {
    cy.login('participant1@bootcamp.com', 'participant123');
    cy.visit('/events');
  });

  it('should register for an event', () => {
    cy.contains('AI Bootcamp').parent().find('button').contains('Register').click();
    cy.contains('Successfully registered').should('be.visible');
  });
});
```

### Custom Commands

```typescript
// cypress/support/commands.ts
Cypress.Commands.add('login', (email: string, password: string) => {
  cy.request('POST', 'http://localhost:3000/auth/login', { email, password })
    .then((response) => {
      window.localStorage.setItem('token', response.body.accessToken);
    });
});
```

## Test Scenarios

### Critical Paths

1. **Authentication**
   - ✅ Login with valid credentials
   - ✅ Login with invalid credentials
   - ✅ Logout

2. **Event Management**
   - ✅ List events
   - ✅ Create event (admin/staff)
   - ✅ View event details

3. **Registration**
   - ✅ Register for event
   - ✅ Prevent duplicate registration
   - ✅ Enforce capacity limit (50 max)

4. **Attendance**
   - ✅ Mark attendance (staff)
   - ✅ View attendance list

5. **Certificates**
   - ✅ Issue certificate (PDF + QR)
   - ✅ Verify certificate with valid code
   - ✅ Reject certificate with invalid code

6. **Audit**
   - ✅ Log key actions
   - ✅ Retrieve audit logs (admin/staff only)

## CI/CD Integration

### GitHub Actions Example

```yaml
name: Test

on: [push, pull_request]

jobs:
  backend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: 20
      - run: cd backend && npm ci
      - run: cd backend && npm test -- --coverage

  frontend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: 20
      - run: cd frontend && npm ci
      - run: cd frontend && npm test -- --no-watch --code-coverage

  e2e:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: 20
      - run: cd backend && npm ci && npm run build
      - run: cd frontend && npm ci
      - run: cd backend && npm run seed
      - run: cd backend && npm start & cd frontend && npm start &
      - run: cd frontend && npm run e2e:headless
```

## Best Practices

1. **Arrange-Act-Assert** pattern for unit tests
2. **Mock external dependencies** (repositories, HTTP calls)
3. **Test isolation**: Each test should be independent
4. **Descriptive test names**: "should do X when Y"
5. **Data cleanup**: Reset database state between e2e tests
6. **Custom commands**: Reuse common flows (login, navigation)
7. **Avoid hard-coded delays**: Use `cy.wait()` with aliases

## Debugging

### Backend Tests
```bash
node --inspect-brk node_modules/.bin/jest --runInBand
```

### Cypress Tests
- Use `cy.debug()` or `cy.pause()` in tests
- Check screenshots in `cypress/screenshots/`
- Review videos in `cypress/videos/`

## Coverage Reports

### Backend
```bash
cd backend
npm test -- --coverage
open coverage/lcov-report/index.html
```

### Frontend
```bash
cd frontend
npm test -- --no-watch --code-coverage
open coverage/index.html
```
