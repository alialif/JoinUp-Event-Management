# Architecture Overview

JoinUp uses a modern, scalable architecture with a clear separation of concerns between frontend and backend.

---

## System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                      Client Layer                           │
│  ┌─────────────────────────────────────────────────────┐   │
│  │   Angular 20+ SPA (Standalone Components)            │   │
│  │   - Zoneless architecture                             │   │
│  │   - Reactive with RxJS                               │   │
│  │   - ngx-translate for i18n                            │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                              │
│                  ↓ HTTP/REST API ↓                           │
│                                                              │
├─────────────────────────────────────────────────────────────┤
│                   Server Layer (NestJS)                      │
│  ┌─────────────────────────────────────────────────────┐   │
│  │         REST API Controllers & DTOs                 │   │
│  │  - Auth (JWT)                                       │   │
│  │  - Events CRUD                                      │   │
│  │  - Registrations                                    │   │
│  │  - Attendance                                       │   │
│  │  - Certificates (PDF + QR)                          │   │
│  │  - Audit Logging                                    │   │
│  └─────────────────────────────────────────────────────┘   │
│                           ↓                                  │
│  ┌─────────────────────────────────────────────────────┐   │
│  │         Business Logic Layer (Services)             │   │
│  │  - Data validation                                  │   │
│  │  - Business rules                                   │   │
│  │  - External integrations (Puppeteer)                │   │
│  └─────────────────────────────────────────────────────┘   │
│                           ↓                                  │
│  ┌─────────────────────────────────────────────────────┐   │
│  │    Data Access Layer (TypeORM Repository)           │   │
│  │  - Database queries                                 │   │
│  │  - Transaction management                           │   │
│  │  - Relationship management                          │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                              │
│                  ↓ SQL Queries ↓                             │
│                                                              │
├─────────────────────────────────────────────────────────────┤
│                    Data Layer (SQLite)                       │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  SQLite Database (data.sqlite)                      │   │
│  │  - Members (Users)                                  │   │
│  │  - Events                                           │   │
│  │  - Registrations                                    │   │
│  │  - Attendance                                       │   │
│  │  - Certificates                                     │   │
│  │  - Audit Logs                                       │   │
│  └─────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

---

## Frontend Architecture

### Technology Stack

- **Framework**: Angular 20+
- **Architecture**: Standalone Components (Zoneless)
- **State Management**: RxJS Observables
- **HTTP**: HttpClient
- **Styling**: SCSS
- **Internationalization**: ngx-translate
- **UI Components**: CGI Components Library

### Frontend Structure

```
frontend/
├── src/
│   ├── app/
│   │   ├── app.config.ts          # App configuration
│   │   ├── app.routes.ts          # Route definitions
│   │   ├── app.ts                 # Root component
│   │   │
│   │   ├── core/                  # Core services & guards
│   │   │   ├── api.service.ts     # HTTP client
│   │   │   ├── auth.service.ts    # Authentication
│   │   │   ├── auth.guard.ts      # Route protection
│   │   │   ├── auth.interceptor.ts # JWT token injection
│   │   │   ├── has-role.directive.ts # Role-based UI
│   │   │   ├── loading.service.ts
│   │   │   ├── toast.service.ts   # Notifications
│   │   │   └── models.ts          # TypeScript interfaces
│   │   │
│   │   ├── features/              # Feature modules
│   │   │   ├── login/             # Login & registration
│   │   │   ├── shell/             # App shell with sidebar
│   │   │   ├── events/            # Event list, detail, create
│   │   │   ├── attendance/        # Mark attendance
│   │   │   ├── certificates/      # Certificate verification
│   │   │   └── members/           # User management
│   │   │
│   │   └── shared/                # Shared UI components
│   │       ├── spinner.component.ts
│   │       └── toast-container.component.ts
│   │
│   ├── assets/
│   │   └── i18n/                  # Translation files
│   │       ├── en.json
│   │       └── fr-CA.json
│   │
│   └── styles.scss                # Global styles
├── public/                        # Static assets
├── angular.json                   # Angular config
└── tsconfig.json
```

### Key Components

**Authentication:**
- JWT tokens stored in localStorage
- Auto-refresh on page load
- Interceptor adds token to requests
- Guard prevents unauthorized access

**API Integration:**
- Centralized API service
- Error handling middleware
- Request/response transformation
- Base URL configuration

**Routing:**
- Route guards for protected pages
- Role-based route access
- Lazy loading where applicable
- Error boundaries for failed navigation

---

## Backend Architecture

### Technology Stack

- **Framework**: NestJS 10+
- **Database**: SQLite + TypeORM
- **Authentication**: JWT with bcrypt
- **PDF Generation**: Puppeteer
- **Documentation**: Swagger/OpenAPI
- **Testing**: Jest

### Backend Structure

```
backend/
├── src/
│   ├── main.ts                    # App entry point
│   ├── app.module.ts              # Root module
│   │
│   ├── auth/                      # Authentication
│   │   ├── auth.controller.ts
│   │   ├── auth.service.ts
│   │   ├── jwt.strategy.ts        # JWT validation
│   │   ├── roles.guard.ts         # Role-based access
│   │   ├── roles.decorator.ts     # @Roles() decorator
│   │   └── dto/
│   │       ├── login.dto.ts
│   │       ├── register.dto.ts
│   │       └── change-role.dto.ts
│   │
│   ├── events/                    # Event management
│   │   ├── events.controller.ts   # REST endpoints
│   │   ├── events.service.ts      # Business logic
│   │   └── dto/
│   │       └── create-event.dto.ts
│   │
│   ├── registrations/             # Event registration
│   │   ├── registrations.controller.ts
│   │   └── registrations.service.ts
│   │
│   ├── attendance/                # Attendance tracking
│   │   ├── attendance.controller.ts
│   │   └── attendance.service.ts
│   │
│   ├── certificates/              # Certificate generation
│   │   ├── certificates.controller.ts
│   │   ├── certificates.service.ts # Puppeteer integration
│   │   └── qr-code.service.ts      # QR code generation
│   │
│   ├── audit/                     # Audit logging
│   │   ├── audit.controller.ts
│   │   └── audit.service.ts
│   │
│   ├── entities/                  # TypeORM entities
│   │   ├── member.entity.ts       # Users
│   │   ├── event.entity.ts
│   │   ├── registration.entity.ts
│   │   ├── attendance.entity.ts
│   │   ├── certificate.entity.ts
│   │   └── audit-log.entity.ts
│   │
│   └── seed/                      # Database seeding
│       └── seed.ts
│
├── tests/                         # Integration tests
├── jest.config.js
├── nest-cli.json
└── tsconfig.json
```

### Module Organization

**Modular Design:**
- Each feature is a self-contained module
- Clear dependencies between modules
- Shared services in a common module (if needed)
- Controller → Service → Repository pattern

**Service Layer:**
- Encapsulates business logic
- Reusable across controllers
- Dependencies injected via constructor
- Database operations delegated to repositories

**Data Validation:**
- DTOs define request/response contracts
- Class validators for input validation
- Type safety with TypeScript
- Automatic OpenAPI documentation

---

## Database Schema

### Entity Relationships

```
Member (User)
  ├─ 1:N ─→ Registration
  ├─ 1:N ─→ Attendance
  └─ 1:N ─→ Certificate

Event
  ├─ 1:N ─→ Registration
  ├─ 1:N ─→ Attendance
  └─ 1:N ─→ Certificate

Registration
  ├─ N:1 ─→ Member
  ├─ N:1 ─→ Event
  └─ 1:1 ─→ Certificate

Attendance
  ├─ N:1 ─→ Member
  └─ N:1 ─→ Event

Certificate
  ├─ N:1 ─→ Member
  ├─ N:1 ─→ Event
  └─ 1:1 ─→ Registration

AuditLog
  ├─ Timestamp
  ├─ Action
  ├─ Entity Type
  ├─ Entity ID
  └─ User ID
```

### Core Entities

See [Database Schema Documentation](./11-Database-Schema.md) for detailed field specifications.

---

## Authentication & Security

### Authentication Flow

```
1. User Login
   ├─ POST /auth/login
   └─ {email, password}
        ↓
2. Backend Validation
   ├─ Hash password
   ├─ Compare with stored
   └─ If valid → Generate JWT
        ↓
3. JWT Token
   ├─ Payload: {userId, role, email}
   ├─ Expiry: 24 hours
   └─ Signature: HMAC-SHA256
        ↓
4. Frontend Storage
   ├─ Save to localStorage
   ├─ Add to every request
   └─ Auto-refresh on page load
        ↓
5. Request Authorization
   ├─ Interceptor adds header: Authorization: Bearer <token>
   ├─ Backend validates signature
   ├─ Extracts user info
   └─ Allows access if valid
```

### Security Features

**Password Security:**
- Hashed with bcrypt (10 rounds/salt)
- Never stored in plain text
- Unique salt per password
- Resistant to rainbow table attacks

**Token Security:**
- Signed with secret key (HMAC)
- Includes expiration time
- Stored in secure HTTP-only cookies (best practice)
- Currently in localStorage (consider HTTP-only cookies for production)

**Access Control:**
- Role-based guards on endpoints
- Decorator-based permissions (@Roles('admin'))
- Fine-grained access control per endpoint
- Audit logging of all protected actions

---

## API Design

### REST Principles

- **Resources**: Events, Members, Registrations, etc.
- **Methods**: GET (read), POST (create), PUT (update), DELETE (delete)
- **Status Codes**: 200 (OK), 201 (Created), 400 (Bad Request), 401 (Unauthorized), 404 (Not Found), 500 (Server Error)
- **Error Responses**: Structured error objects with messages

### Request/Response Format

**Request:**
```json
{
  "title": "Angular Workshop",
  "description": "Learn advanced Angular",
  "startDate": "2025-12-15T09:00:00Z",
  "endDate": "2025-12-15T17:00:00Z"
}
```

**Success Response (200):**
```json
{
  "id": 1,
  "title": "Angular Workshop",
  "description": "Learn advanced Angular",
  "startDate": "2025-12-15T09:00:00Z",
  "endDate": "2025-12-15T17:00:00Z",
  "createdAt": "2025-12-10T10:30:00Z"
}
```

**Error Response (400):**
```json
{
  "statusCode": 400,
  "message": "Validation failed",
  "errors": [
    {"field": "title", "message": "Title is required"}
  ]
}
```

---

## Data Flow Examples

### Create Event Flow

```
User (Frontend)
  ├─ Fill form: title, description, dates, capacity, categories
  ├─ Click "Create Event"
  └─ Submit POST /events with event DTO
       ↓
Router (Angular)
  ├─ Validate form fields locally
  ├─ Prepare request with JWT token
  └─ Send HTTP POST request
       ↓
HTTP Interceptor
  ├─ Add Authorization header
  ├─ Add Content-Type: application/json
  └─ Send to backend
       ↓
Events Controller
  ├─ Receive request
  ├─ Validate DTO
  ├─ Check @Roles('staff', 'admin') guard
  └─ Call EventsService.create()
       ↓
Events Service
  ├─ Validate business rules
  ├─ Check dates (end > start)
  ├─ Call repository.save()
  └─ Log to audit service
       ↓
TypeORM Repository
  ├─ Generate INSERT SQL
  ├─ Execute on SQLite
  ├─ Return saved entity
  └─ Transaction commit
       ↓
Events Controller
  ├─ Return 201 Created
  └─ Send event object in response
       ↓
HTTP Client (Frontend)
  ├─ Receive response
  ├─ Parse JSON
  ├─ Update local state
  └─ Show success toast
       ↓
User (Frontend)
  └─ See confirmation message & event in list
```

---

## Error Handling

### Backend Error Handling

**Global Exception Filter:**
- Catches all unhandled exceptions
- Formats error responses
- Logs errors for debugging
- Returns appropriate HTTP status code

**Validation Errors:**
- Class-validator decorators
- Automatic validation on DTOs
- Returns 400 with detailed field errors

### Frontend Error Handling

**HTTP Interceptor:**
- Catches HTTP errors
- Checks for authentication errors (401)
- Redirects to login if token expired
- Shows toast notifications for errors

**Component Error Boundary:**
- Catches component errors
- Prevents app from crashing
- Shows fallback UI
- Logs to error tracking (if configured)

---

## Performance Considerations

### Caching

**Frontend:**
- Component state caching
- HTTP response caching (partial)
- Observable caching with RxJS shareReplay

**Backend:**
- Database query optimization with indexes
- Lazy loading of relationships
- Pagination for large datasets

### Pagination

**API Endpoints:**
- Support limit/offset parameters
- Default limit: 50 items
- Prevents memory issues with large datasets
- Improves response time

### Database Optimization

- Proper indexing on frequently queried fields
- Foreign key constraints for data integrity
- Cascade delete rules
- Query optimization in services

---

## Scalability Considerations

### Current Architecture Limitations

- Single SQLite database (file-based)
- Single backend process
- No horizontal scaling
- Limited concurrent connections

### Scaling Path

1. **Database Upgrade**: PostgreSQL/MySQL for multi-connection support
2. **API Scaling**: Load balancing with multiple backend instances
3. **Caching Layer**: Redis for session/data caching
4. **CDN**: For static assets and frontend distribution
5. **Microservices**: Split into separate services if needed

---

## Testing Architecture

### Test Pyramid

```
      /\
     /E2E\         (End-to-End tests)
    /      \       Cypress, Playwright
   /--------\
  /Integration\    (Integration tests)
 /    Tests     \  Jest with API calls
/________________\
/  Unit Tests     \ (Service, component logic tests)
/________________  \ Jest, Jasmine
```

### Test Organization

- **Unit Tests**: Per service/component
- **Integration Tests**: API endpoints, database
- **E2E Tests**: Complete user workflows
- **Coverage Target**: 80%+ code coverage

---

## Deployment Considerations

### Frontend Deployment

- Build output: `dist/frontend/`
- Static files can be served from CDN
- Environment variables via environment.ts
- Requires Node.js 20+ for build process

### Backend Deployment

- Build output: `dist/` directory
- Requires Node.js 20+ runtime
- SQLite database included in deployment
- Environment variables from .env file

### Environment Configuration

- Production vs Development settings
- Database connection string
- JWT secret key (must be unique per environment)
- API base URLs
- Logging levels

---

## Related Documentation

- [Database Schema](./11-Database-Schema.md)
- [API Reference](./10-API-Reference.md)
- [Architecture Decision Records](./12-ADRs.md)
- [Testing Guide](./13-Testing-Guide.md)
- [Deployment Guide](./19-Deployment.md)

---

**Need help?** Check [Troubleshooting - Architecture](./15-Troubleshooting.md#architecture-issues)
