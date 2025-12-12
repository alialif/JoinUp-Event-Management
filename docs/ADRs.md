# Architecture Decision Records (ADRs)

## ADR-001: Authentication Strategy

**Date:** November 2025  
**Status:** Accepted

**Context:**  
Need simple authentication for internal bootcamp app with three roles (admin, staff, participant).

**Decision:**  
Use JWT (JSON Web Tokens) with bcrypt password hashing.

**Rationale:**
- Stateless authentication suitable for REST API
- Simple to implement with Passport.js / NestJS
- No external dependencies (SSO not required)
- Tokens expire after 24h for security

**Consequences:**
- Tokens stored in localStorage (frontend)
- Refresh token mechanism not implemented (can add later)
- Session management minimal

---

## ADR-002: i18n Approach

**Date:** November 2025  
**Status:** Accepted

**Context:**  
App must support English and French Canadian.

**Decision:**  
Use `ngx-translate` for runtime translation.

**Rationale:**
- Runtime language switching without recompile
- Simple JSON translation files
- Lightweight and widely adopted
- No build-time i18n complexity (vs Angular built-in)

**Consequences:**
- Translation keys managed in `en.json`, `fr-CA.json`
- Missing keys fall back to default language (en)
- Slightly larger bundle vs compile-time i18n

---

## ADR-003: Certificate Generation

**Date:** November 2025  
**Status:** Accepted

**Context:**  
Generate PDF certificates with QR codes for verification.

**Decision:**  
Use Puppeteer to render HTML templates to PDF with embedded QR codes (via `qrcode` library).

**Rationale:**
- Full control over certificate design (HTML/CSS)
- QR code generation simple with `qrcode` npm package
- Puppeteer widely used and stable
- Alternative (`pdf-lib`) requires more manual layout

**Consequences:**
- Puppeteer requires headless Chrome (deployment consideration)
- PDF generation synchronous (consider queue for scale)
- QR data: `{registrationId}|{sequentialCode}` for verification

---

## ADR-004: Data Persistence

**Date:** November 2025  
**Status:** Accepted

**Context:**  
Need local database for up to 50 registrations per event.

**Decision:**  
Use SQLite with TypeORM.

**Rationale:**
- Zero-config local database
- Transactional integrity
- TypeORM provides entity management and migrations
- Simple backup (single file)
- Sufficient for small-scale internal use

**Consequences:**
- No horizontal scaling (single-file DB)
- Consider Azure Cosmos DB migration if multi-region required
- Audit logs retained indefinitely (no auto-purge)

---

## ADR-005: Audit Logging

**Date:** November 2025  
**Status:** Accepted

**Context:**  
Track key actions for compliance and debugging.

**Decision:**  
Persist audit entries in `AuditLog` entity with indefinite retention.

**Rationale:**
- Simple append-only log
- Queryable via TypeORM
- No external log aggregation needed (internal tool)
- Admin/staff can view via `/audit` endpoint

**Consequences:**
- SQLite file size grows over time (acceptable for internal use)
- No log rotation or archival implemented
- Performance impact minimal (indexed by `createdAt`)

---

## ADR-006: Frontend Architecture

**Date:** November 2025  
**Status:** Accepted

**Context:**  
Angular 20+ with standalone components and zoneless change detection.

**Decision:**  
Modular structure: `core` (services, guards), `shared` (UI components), `features` (business modules).

**Rationale:**
- Separation of concerns
- Reusable components in `shared` (CGI library integration)
- Lazy-loadable feature modules for scalability
- Zoneless improves performance

**Consequences:**
- Manual change detection management (signals or `markForCheck`)
- More boilerplate for lazy loading
- Clear boundaries between layers

---

## ADR-007: Testing Strategy

**Date:** November 2025  
**Status:** Accepted

**Context:**  
Validate backend services, frontend components, and critical flows.

**Decision:**  
- Backend: Jest unit tests (services, controllers)
- Frontend: Jasmine/Karma unit tests (components, services)
- E2E: Cypress for integration flows (registration, attendance, certificate)

**Rationale:**
- Jest fast for Node.js backend
- Jasmine/Karma default Angular tooling
- Cypress mature for e2e with good debugging

**Consequences:**
- Dual test runners (backend Jest, frontend Karma)
- E2E tests run against dev servers (separate CI step)
- Coverage targets: backend 70%+, frontend 60%+

---

## ADR-008: CGI Component Library Integration

**Date:** November 2025  
**Status:** Accepted

**Context:**  
Leverage existing CGI branded components for consistency.

**Decision:**  
Import CGI components library in `SharedModule` and use throughout app.

**Rationale:**
- Corporate design system compliance
- Pre-built navigation, alerts, modals, etc.
- Reduces custom UI development

**Consequences:**
- Dependency on CGI component library versioning
- May need custom theme overrides for colors
- Documentation in library package
