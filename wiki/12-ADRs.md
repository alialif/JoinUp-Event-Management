# Architecture Decision Records (ADRs)

This document records important architectural decisions and their rationale.

---

## ADR-001: Standalone Angular Components Architecture

**Status**: Adopted  
**Date**: December 2025  
**Deciders**: AI Bootcamp Team

### Context

Angular 14+ introduced standalone components, eliminating the need for NgModules. This provides:
- Simpler mental model
- Reduced boilerplate
- Tree-shaking friendly
- Faster compilation

### Decision

Use standalone components exclusively throughout the frontend application.

### Rationale

1. **Simplicity**: No NgModule boilerplate, straightforward dependency injection
2. **Performance**: Better tree-shaking and smaller bundle sizes
3. **Modularity**: Clear component boundaries and dependencies
4. **Future-Proof**: Angular team investing in zoneless architecture

### Consequences

- ✅ Faster development
- ✅ Easier to understand codebase
- ✅ Smaller production bundles
- ❌ Requires Angular 14+
- ❌ Cannot use older libraries depending on NgModules

### Related Code

- [app.routes.ts](../frontend/src/app/app.routes.ts)
- [app.config.ts](../frontend/src/app/app.config.ts)

---

## ADR-002: NestJS for Backend Framework

**Status**: Adopted  
**Date**: December 2025  
**Deciders**: AI Bootcamp Team

### Context

Multiple backend frameworks available: Express, Fastify, Koa, Hapi, NestJS.

### Decision

Use NestJS as the backend framework for this project.

### Rationale

1. **Opinionated Structure**: Clear layers (controller, service, repository)
2. **TypeScript First**: Full TypeScript support built-in
3. **Decorators & Annotations**: Similar to Spring Boot / Java
4. **Built-in Features**: Dependency injection, validation, authentication
5. **Scalability**: Designed for enterprise applications
6. **Documentation**: Excellent and comprehensive

### Consequences

- ✅ Enterprise-grade structure
- ✅ Large ecosystem of modules
- ✅ Excellent for team projects
- ✅ Easy onboarding
- ❌ Larger framework complexity
- ❌ Slightly slower than bare Express for simple APIs
- ❌ Learning curve for developers new to it

### Related Code

- [app.module.ts](../backend/src/app.module.ts)
- All controllers and services in [src/](../backend/src/)

---

## ADR-003: SQLite for Development Database

**Status**: Adopted  
**Date**: December 2025  
**Deciders**: AI Bootcamp Team

### Context

Database choice for local development and testing. Options: SQLite, PostgreSQL, MySQL, MongoDB.

### Decision

Use SQLite for development. PostgreSQL recommended for production.

### Rationale

1. **Ease of Setup**: Zero configuration, single file
2. **No Dependencies**: No server to start
3. **Perfect for Testing**: Each test can have fresh database
4. **File-Based**: Easy to backup and version control
5. **Learning**: Great for learning SQL and database concepts

### Consequences

- ✅ No database server setup
- ✅ Easy to seed and reset
- ✅ Lightweight for small datasets
- ❌ Not suitable for production with multiple users
- ❌ Limited concurrent connections
- ❌ No advanced features (replication, clustering)

### Upgrade Path

```
Development: SQLite → Test: SQLite → Staging: PostgreSQL → Production: PostgreSQL
```

### Related Code

- [TypeORM configuration](../backend/src/app.module.ts)
- [Seed script](../backend/src/seed/seed.ts)

---

## ADR-004: JWT for Authentication

**Status**: Adopted  
**Date**: December 2025  
**Deciders**: AI Bootcamp Team

### Context

Authentication mechanism for API requests. Options: Sessions, JWT, OAuth2, API Keys.

### Decision

Use JWT (JSON Web Tokens) for stateless authentication.

### Rationale

1. **Stateless**: No server-side session storage
2. **Scalable**: Easy to scale to multiple servers
3. **Mobile-Friendly**: Works great with mobile clients
4. **Standard**: Industry-standard approach
5. **Self-Contained**: Token contains user info and signature

### Consequences

- ✅ No session database needed
- ✅ Easy horizontal scaling
- ✅ Mobile app friendly
- ✅ Microservices compatible
- ❌ Token revocation harder (implement blacklist)
- ❌ Token size larger than session ID
- ❌ Cannot invalidate immediately

### Security Measures

- Tokens expire after 24 hours
- Secret key stored in environment variables
- HMAC-SHA256 signing algorithm
- Consider HTTP-only cookies for production

### Related Code

- [JWT Strategy](../backend/src/auth/jwt.strategy.ts)
- [Auth Controller](../backend/src/auth/auth.controller.ts)
- [Auth Interceptor](../frontend/src/app/core/auth.interceptor.ts)

---

## ADR-005: Role-Based Access Control (RBAC)

**Status**: Adopted  
**Date**: December 2025  
**Deciders**: AI Bootcamp Team

### Context

Authorization strategy for different user types. Options: RBAC, ABAC, ACL.

### Decision

Implement Role-Based Access Control with three roles: Participant, Staff, Admin.

### Rationale

1. **Simple to Understand**: Clear role hierarchy
2. **Easy to Implement**: Guard-based access checking
3. **Maintainable**: Easy to add new roles or modify permissions
4. **Scalable**: Works for small and medium systems
5. **Business Aligned**: Maps to organizational structure

### Role Hierarchy

```
Admin
  ↓ (has all permissions of)
Staff
  ↓ (has all permissions of)
Participant
```

### Consequences

- ✅ Clear permission model
- ✅ Easy to audit access
- ✅ Simple role-based UI hiding
- ❌ Cannot handle complex permission rules
- ❌ Requires role migration strategy
- ❌ Limited flexibility for nuanced permissions

### Future Improvement

If complex permissions needed:
- Migrate to ABAC (Attribute-Based Access Control)
- Implement permission groups
- Add fine-grained resource-level permissions

### Related Code

- [Roles Guard](../backend/src/auth/roles.guard.ts)
- [Roles Decorator](../backend/src/auth/roles.decorator.ts)
- [Role Entity](../backend/src/entities/member.entity.ts)

---

## ADR-006: Puppeteer for PDF Generation

**Status**: Adopted  
**Date**: December 2025  
**Deciders**: AI Bootcamp Team

### Context

Generating PDF certificates from HTML templates. Options: Puppeteer, PhantomJS, wkhtmltopdf, PDFKit.

### Decision

Use Puppeteer with headless Chrome for PDF generation.

### Rationale

1. **Chrome-Based**: Uses real browser rendering engine
2. **Reliable**: Excellent CSS and JavaScript support
3. **Maintained**: Active development and support
4. **Feature-Rich**: Screenshots, PDFs, performance analysis
5. **Quality**: Pixel-perfect rendering

### Consequences

- ✅ Professional PDF output
- ✅ Complex CSS support
- ✅ SVG and QR codes render perfectly
- ✅ Consistent cross-platform
- ❌ Memory intensive (requires Chrome)
- ❌ Slower than lightweight alternatives
- ❌ Docker setup required

### Configuration

```typescript
const browser = await puppeteer.launch({
  headless: 'new',
  args: ['--no-sandbox'],
});
```

### Related Code

- [Certificate Service](../backend/src/certificates/certificates.service.ts)

---

## ADR-007: Internationalization with ngx-translate

**Status**: Adopted  
**Date**: December 2025  
**Deciders**: AI Bootcamp Team

### Context

Multi-language support for English and French-Canadian. Options: i18next, ngx-translate, Lingui, gettext.

### Decision

Use ngx-translate for internationalization with JSON translation files.

### Rationale

1. **Angular Native**: Built for Angular, deep integration
2. **Simple**: JSON file structure, easy to maintain
3. **Flexible**: Load translations at runtime
4. **Pipes & Directives**: Easy template integration
5. **Documented**: Great documentation and community

### Translation Strategy

- **Key-Based**: All UI strings as keys in translation files
- **Lazy-Loaded**: Load translations per language
- **Fallback**: English as fallback language
- **Type-Safe**: Create constants for key names (optional)

### Consequences

- ✅ Clear separation of content and code
- ✅ Easy to add new languages
- ✅ No string hardcoding
- ✅ Good performance
- ❌ Missing translations obvious
- ❌ Duplicate strings hard to detect
- ❌ Context-specific translations challenging

### File Structure

```
assets/i18n/
├── en.json (English)
└── fr-CA.json (French-Canadian)
```

### Related Code

- [Translation Files](../frontend/src/assets/i18n/)
- [App Config](../frontend/src/app/app.config.ts)

---

## ADR-008: Audit Logging with Indefinite Retention

**Status**: Adopted  
**Date**: December 2025  
**Deciders**: AI Bootcamp Team

### Context

Tracking system changes for compliance and debugging. Options: Log to file, database, external service.

### Decision

Store audit logs in database with indefinite retention policy.

### Rationale

1. **Queryable**: Can search and filter audit logs
2. **Real-Time**: Logs available immediately
3. **Integration**: Audit data part of main database
4. **Compliance**: Satisfies audit trail requirements
5. **Analytics**: Can generate reports from audit data

### Logged Events

- User authentication (login/logout)
- Account creation and modification
- Role changes
- Event creation/update/deletion
- Attendance marking
- Certificate issuance
- Admin actions

### Retention Policy

- **Indefinite**: No automatic deletion
- **Archival**: Move old logs to archive (optional)
- **Compliance**: Meet regulatory requirements

### Consequences

- ✅ Full audit trail available
- ✅ Helps detect unauthorized access
- ✅ Supports compliance requirements
- ✅ Useful for debugging issues
- ❌ Database grows over time
- ❌ Performance impact on queries
- ❌ Storage costs increase

### Optimization Strategy

1. Index on timestamp and entityType
2. Partitioning by year (for very large datasets)
3. Archive to cold storage periodically
4. Compression of old records

### Related Code

- [Audit Entity](../backend/src/entities/audit-log.entity.ts)
- [Audit Service](../backend/src/audit/audit.service.ts)

---

## ADR-009: RxJS for State Management

**Status**: Adopted  
**Date**: December 2025  
**Deciders**: AI Bootcamp Team

### Context

Managing state in Angular frontend. Options: RxJS Subjects, NgRx, Akita, Zustand.

### Decision

Use RxJS Observables and Subjects for state management without additional library.

### Rationale

1. **No Dependencies**: RxJS already required by Angular
2. **Lightweight**: No additional abstraction layers
3. **Composable**: Powerful combination of operators
4. **Learning**: Good for learning reactive programming
5. **Sufficient**: Adequate for application complexity level

### Limitations & When to Upgrade

If application grows and state management becomes complex:
- Migrate to NgRx for Flux-like architecture
- Implement proper state machines
- Add time-travel debugging
- Implement undo/redo functionality

### Related Code

- [Auth Service](../frontend/src/app/core/auth.service.ts)
- [Loading Service](../frontend/src/app/core/loading.service.ts)

---

## ADR-010: Testing Strategy - Test Pyramid

**Status**: Adopted  
**Date**: December 2025  
**Deciders**: AI Bootcamp Team

### Context

Testing approach for ensuring quality. Options: Only E2E, only unit, pyramid, diamond.

### Decision

Implement test pyramid: Majority unit tests, some integration tests, fewer E2E tests.

### Rationale

1. **Speed**: Unit tests run fast, quick feedback
2. **Reliability**: E2E tests can be flaky
3. **Cost**: E2E tests expensive to maintain
4. **Coverage**: Unit tests can cover edge cases
5. **Efficiency**: Optimal testing ROI

### Test Distribution

```
E2E Tests (10%)      ← Cypress, Playwright
Integration (20%)    ← API endpoint tests
Unit Tests (70%)     ← Service, component logic
```

### Coverage Targets

- **Overall**: 80%+ code coverage
- **Services**: 90%+ coverage
- **Components**: 80%+ coverage
- **Controllers**: 85%+ coverage

### Consequences

- ✅ Fast feedback loop
- ✅ High confidence in refactoring
- ✅ Maintainable test suite
- ✅ Cost-effective
- ❌ Requires discipline
- ❌ Integration coverage gaps possible
- ❌ Some bugs only caught by E2E

### Related Code

- [Backend Tests](../backend/src/)
- [Frontend Tests](../frontend/src/)
- [E2E Tests](../frontend/cypress/e2e/)

---

## ADR-011: TypeORM with Synchronize Mode for Development

**Status**: Adopted  
**Date**: December 2025  
**Deciders**: AI Bootcamp Team

### Context

Database schema management during development. Options: Auto-sync, migrations, manual.

### Decision

Use TypeORM synchronize mode for development, migrations for production.

### Rationale

1. **Development Velocity**: Quick iterations without writing migrations
2. **Learning**: Easy to experiment with schema changes
3. **Production Safety**: Explicit migrations for production
4. **Best Practice**: Follows industry patterns

### Consequences

- ✅ Fast development
- ✅ No migration boilerplate
- ✅ Schema always in sync with code
- ❌ Data loss possible (schema recreation)
- ❌ Not suitable for production
- ❌ Requires migration before deployment

### Production Approach

```typescript
// Development
synchronize: true

// Production
synchronize: false
// Run migrations with: npm run typeorm migration:run
```

### Related Code

- [TypeORM Config](../backend/src/app.module.ts)

---

## Summary Table

| ADR | Topic | Status | Decision |
|-----|-------|--------|----------|
| 001 | Frontend Framework | Adopted | Angular 20+ Standalone Components |
| 002 | Backend Framework | Adopted | NestJS |
| 003 | Dev Database | Adopted | SQLite (PostgreSQL for prod) |
| 004 | Authentication | Adopted | JWT with 24h expiry |
| 005 | Authorization | Adopted | Role-Based Access Control (3 roles) |
| 006 | PDF Generation | Adopted | Puppeteer with Chrome |
| 007 | i18n | Adopted | ngx-translate with JSON files |
| 008 | Audit Logging | Adopted | Database with indefinite retention |
| 009 | State Management | Adopted | RxJS Observables (upgrade path to NgRx) |
| 010 | Testing | Adopted | Test Pyramid (70% unit, 20% integration, 10% E2E) |
| 011 | Database Schema | Adopted | TypeORM synchronize (dev), migrations (prod) |

---

## References

- [Architecture Overview](./09-Architecture.md)
- [Testing Guide](./13-Testing-Guide.md)
- [Deployment Guide](./19-Deployment.md)

---

**Need help?** Check [Troubleshooting - Architecture](./15-Troubleshooting.md#architecture-issues)
