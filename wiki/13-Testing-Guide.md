# Testing Guide

Comprehensive guide to testing strategies, tools, and best practices in JoinUp.

---

## Testing Overview

JoinUp implements a comprehensive testing strategy across three levels:

```
        E2E Tests (10%)
      Cypress / Playwright
              ▲
              │
    Integration Tests (20%)
       Jest + API Calls
              ▲
              │
    Unit Tests (70%)
    Jest + Component Tests
```

---

## Test Environment Setup

### Prerequisites

- Node.js 20+
- npm 10+
- All dependencies installed

### Install Testing Dependencies

```bash
# Already included in package.json
npm install  # Jest, Cypress, etc. included
```

### Configure Test Database

Testing uses a separate SQLite database:

```bash
# Backend testing
cd backend
npm test  # Uses test.sqlite
```

---

## Unit Tests

### Backend Unit Tests

**Framework**: Jest  
**Location**: `backend/src/**/*.spec.ts`

**Run All Tests**:
```bash
cd backend
npm test
```

**Run Specific Test File**:
```bash
npm test -- auth.service.spec
```

**Run with Coverage**:
```bash
npm test:cov
```

**Watch Mode**:
```bash
npm test -- --watch
```

### Test Structure

**Example Service Test**:

```typescript
import { Test, TestingModule } from '@nestjs/testing';
import { EventsService } from './events.service';
import { Repository } from 'typeorm';
import { Event } from '../entities/event.entity';

describe('EventsService', () => {
  let service: EventsService;
  let repository: Repository<Event>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EventsService,
        {
          provide: 'EventRepository',
          useValue: {
            find: jest.fn(),
            findOne: jest.fn(),
            save: jest.fn(),
            delete: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<EventsService>(EventsService);
    repository = module.get('EventRepository');
  });

  describe('create', () => {
    it('should create an event', async () => {
      const createEventDto = { ... };
      const result = { id: 1, ...createEventDto };

      jest.spyOn(repository, 'save').mockResolvedValue(result);

      expect(await service.create(createEventDto)).toEqual(result);
    });
  });

  describe('findAll', () => {
    it('should return array of events', async () => {
      const events = [{ id: 1, ... }];
      jest.spyOn(repository, 'find').mockResolvedValue(events);

      expect(await service.findAll()).toEqual(events);
    });
  });
});
```

### Frontend Unit Tests

**Framework**: Jest + Angular Testing Utilities  
**Location**: `frontend/src/**/*.spec.ts`

**Run All Tests**:
```bash
cd frontend
npm test
```

**Run Specific Test**:
```bash
npm test -- --testPathPattern=auth
```

**Example Component Test**:

```typescript
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LoginComponent } from './login.component';
import { AuthService } from '../core/auth.service';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let authService: jasmine.SpyObj<AuthService>;

  beforeEach(async () => {
    const spy = jasmine.createSpyObj('AuthService', ['login']);

    await TestBed.configureTestingModule({
      imports: [LoginComponent],
      providers: [
        { provide: AuthService, useValue: spy }
      ],
    }).compileComponents();

    authService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call login on submit', () => {
    authService.login.and.returnValue(of({}));
    
    component.form.patchValue({
      email: 'test@example.com',
      password: 'test123'
    });
    component.onSubmit();

    expect(authService.login).toHaveBeenCalledWith(
      'test@example.com',
      'test123'
    );
  });
});
```

### Coverage Reports

**Backend Coverage**:
```bash
cd backend
npm run test:cov
# Coverage report in coverage/ directory
```

**Frontend Coverage**:
```bash
cd frontend
npm test -- --coverage
# Coverage report in coverage/ directory
```

**Viewing Reports**:
```bash
# Open HTML report
open backend/coverage/index.html
open frontend/coverage/index.html
```

---

## Integration Tests

### Backend Integration Tests

**Framework**: Jest with test database  
**Location**: `backend/tests/` (or `.e2e-spec.ts` files)

**Run Integration Tests**:
```bash
cd backend
npm run test:e2e
```

### Test Database

Integration tests use a test database:

```typescript
// test-setup.ts
beforeAll(async () => {
  // Create connection to test database
  const app = await NestFactory.create(AppModule);
  await app.listen(3001); // Test port
});

afterAll(async () => {
  // Clean up and disconnect
});

afterEach(async () => {
  // Truncate tables between tests
});
```

### API Endpoint Testing

**Example Integration Test**:

```typescript
import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';

describe('Events (e2e)', () => {
  let app: INestApplication;
  let token: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    // Get auth token
    const res = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email: 'admin@test.com', password: 'admin123' });
    token = res.body.access_token;
  });

  afterAll(async () => {
    await app.close();
  });

  describe('GET /events', () => {
    it('should return array of events', () => {
      return request(app.getHttpServer())
        .get('/events')
        .set('Authorization', `Bearer ${token}`)
        .expect(200)
        .expect((res) => {
          expect(res.body.data).toBeInstanceOf(Array);
        });
    });
  });

  describe('POST /events', () => {
    it('should create event', () => {
      return request(app.getHttpServer())
        .post('/events')
        .set('Authorization', `Bearer ${token}`)
        .send({
          title: 'Test Event',
          description: 'Test',
          startDate: '2025-12-15T09:00:00Z',
          endDate: '2025-12-15T17:00:00Z',
          capacity: 50,
        })
        .expect(201)
        .expect((res) => {
          expect(res.body.id).toBeDefined();
          expect(res.body.title).toEqual('Test Event');
        });
    });
  });
});
```

---

## End-to-End Tests

### Frontend E2E Tests

**Framework**: Cypress  
**Location**: `frontend/cypress/e2e/`

**Run All E2E Tests**:
```bash
cd frontend
npm run e2e
```

**Run Headless**:
```bash
npm run e2e:headless
```

**Run Specific Test**:
```bash
npx cypress run --spec "cypress/e2e/login.cy.ts"
```

### Cypress Test Example

**File**: `cypress/e2e/login.cy.ts`

```typescript
describe('Login', () => {
  beforeEach(() => {
    cy.visit('http://localhost:4200/login');
  });

  it('should login with valid credentials', () => {
    cy.get('[data-testid="email-input"]').type('admin@bootcamp.com');
    cy.get('[data-testid="password-input"]').type('admin123');
    cy.get('[data-testid="login-button"]').click();

    cy.url().should('include', '/events');
    cy.contains('Events').should('be.visible');
  });

  it('should show error with invalid credentials', () => {
    cy.get('[data-testid="email-input"]').type('invalid@test.com');
    cy.get('[data-testid="password-input"]').type('wrongpassword');
    cy.get('[data-testid="login-button"]').click();

    cy.get('[data-testid="error-message"]')
      .should('be.visible')
      .should('contain', 'Invalid credentials');
  });

  it('should register new user', () => {
    cy.get('[data-testid="register-link"]').click();
    cy.url().should('include', '/register');

    cy.get('[data-testid="name-input"]').type('John Doe');
    cy.get('[data-testid="email-input"]').type('john@example.com');
    cy.get('[data-testid="password-input"]').type('password123');
    cy.get('[data-testid="confirm-password-input"]').type('password123');
    cy.get('[data-testid="birth-date-input"]').type('1990-05-15');
    cy.get('[data-testid="gender-select"]').select('male');
    cy.get('[data-testid="register-button"]').click();

    cy.url().should('include', '/login');
  });
});
```

### Critical E2E Scenarios

**Event Registration Flow**:
1. Login as participant
2. Navigate to events
3. Click register on event
4. Confirm registration
5. See registered status
6. Logout

**Staff Event Management**:
1. Login as staff
2. Create new event
3. Mark attendance for participants
4. Issue certificates
5. Verify certificates
6. Logout

**Admin User Management**:
1. Login as admin
2. Go to Users page
3. Change user role
4. Verify role changed
5. View audit logs
6. Logout

---

## Test Data & Seeding

### Seed Database

```bash
cd backend
npm run seed  # Create test data
```

### Default Test Users

```
admin@bootcamp.com / admin123
staff@bootcamp.com / staff123
participant1@bootcamp.com / participant123
```

### Custom Seed Data

Edit [seed.ts](../backend/src/seed/seed.ts):

```typescript
// Add custom events
await queryRunner.manager.save(Event, {
  title: 'Test Event',
  description: 'Test Description',
  startDate: new Date('2025-12-15'),
  endDate: new Date('2025-12-16'),
  capacity: 50,
});
```

---

## Testing Best Practices

### Unit Testing

- ✅ Test one thing per test
- ✅ Use descriptive test names
- ✅ Mock external dependencies
- ✅ Test happy path and error cases
- ✅ Aim for 80%+ coverage
- ❌ Don't test third-party libraries
- ❌ Don't write tests for getters/setters
- ❌ Don't use real databases in unit tests

### Integration Testing

- ✅ Test API contracts
- ✅ Use test database
- ✅ Clean up after tests
- ✅ Test error responses
- ✅ Verify database state changes
- ❌ Don't test implementation details
- ❌ Don't make network requests
- ❌ Don't depend on test order

### E2E Testing

- ✅ Test critical user workflows
- ✅ Use data-testid attributes
- ✅ Wait for elements to appear
- ✅ Test happy path primarily
- ✅ Keep tests DRY (Don't Repeat Yourself)
- ❌ Don't test every possible input
- ❌ Don't assert on CSS properties
- ❌ Don't hardcode wait times

### Naming Conventions

**Test Suites**:
```typescript
describe('EventsService', () => {
  describe('create', () => {
    it('should create event with valid data', () => {});
  });
});
```

**Test Names** (use "should..."):
```
✅ should create event with valid data
✅ should throw error when capacity is 0
✅ should return event by id
❌ test create
❌ event creation
```

---

## Debugging Tests

### Run Tests with Logging

```bash
# Backend
cd backend
npm test -- --detectOpenHandles
npm test -- --verbose

# Frontend
cd frontend
npm test -- --verbose --detectOpenHandles
```

### Debug in VS Code

**Backend Jest Debug Configuration**:

```json
{
  "type": "node",
  "request": "launch",
  "name": "Jest Debug",
  "program": "${workspaceFolder}/backend/node_modules/.bin/jest",
  "args": ["--runInBand"],
  "console": "integratedTerminal"
}
```

**Frontend Cypress Debug**:

```bash
npm run e2e -- --headed --config baseUrl=http://localhost:4200
```

### Common Issues

**Tests timing out**:
- Increase Jest timeout: `jest.setTimeout(10000)`
- Check for unresolved promises
- Verify async/await usage

**Flaky tests**:
- Use cy.visit() before each test
- Wait for elements explicitly
- Don't rely on timing
- Clean up between tests

---

## CI/CD Integration

### GitHub Actions Example

```yaml
name: Tests
on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '20'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Run unit tests
        run: npm test:coverage
      
      - name: Run E2E tests
        run: npm run e2e:ci
```

---

## Coverage Goals

| Category | Target |
|----------|--------|
| Overall | 80%+ |
| Services | 90%+ |
| Components | 80%+ |
| Controllers | 85%+ |
| Utilities | 95%+ |
| Config | 0%* |

*Config files not required to test

---

## Related Documentation

- [Architecture - Testing](./09-Architecture.md#testing-architecture)
- [Test Scenarios](./14-Test-Scenarios.md)
- [Troubleshooting - Testing](./15-Troubleshooting.md#testing-issues)

---

**Need help?** Check [Troubleshooting - Testing](./15-Troubleshooting.md#testing-issues)
