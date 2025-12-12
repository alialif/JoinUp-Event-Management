# System Architecture

## Overview

Bootcamp Management is a client-server web application for managing event registrations, attendance tracking, and certificate issuance.

## High-Level Architecture

```
┌──────────────────────────────────────────────────────────────┐
│                         Frontend                              │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  Angular 20 (zoneless, standalone components)         │   │
│  │  - Core: Auth, API services, Guards, Interceptors     │   │
│  │  - Shared: CGI Components, UI utilities               │   │
│  │  - Features: Events, Registrations, Attendance, Certs │   │
│  │  - i18n: ngx-translate (en, fr-CA)                    │   │
│  └──────────────────────────────────────────────────────┘   │
│                          ↕ HTTP/REST                          │
└──────────────────────────────────────────────────────────────┘
                              ↓
┌──────────────────────────────────────────────────────────────┐
│                         Backend                               │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  NestJS REST API + Swagger                            │   │
│  │  - Auth Module (JWT + Passport)                       │   │
│  │  - Events, Registrations, Attendance, Certificates    │   │
│  │  - Audit Service (log all key actions)                │   │
│  │  - Puppeteer (HTML → PDF + QR code generation)        │   │
│  └──────────────────────────────────────────────────────┘   │
│                          ↕ TypeORM                            │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  SQLite Database (data.sqlite)                        │   │
│  │  - Members (auth + roles)                             │   │
│  │  - Events, Registrations (with sequential codes)      │   │
│  │  - Attendance, Certificates, AuditLog                 │   │
│  └──────────────────────────────────────────────────────┘   │
└──────────────────────────────────────────────────────────────┘
```

## Data Model

### Entity Relationships

```
Member (1) ──< (M) Registration (M) >── (1) Event
  │                    │
  │                    └─> (1) Certificate
  │
  └──< (M) Attendance (M) >── (1) Event

AuditLog (standalone tracking table)
```

### Core Entities

**Member**
- id (UUID)
- email (unique)
- name
- employeeId (optional)
- passwordHash
- role (admin | staff | participant)

**Event**
- id (UUID)
- title
- description
- startDate, endDate
- maxRegistrations (default: 50)

**Registration**
- id (UUID)
- member (FK)
- event (FK)
- sequentialCode (1..N per event, unique within event)
- createdAt

**Attendance**
- id (UUID)
- member (FK)
- event (FK)
- attendedAt
- UNIQUE(member, event)

**Certificate**
- id (UUID)
- registration (FK)
- filePath (stored PDF path)
- issuedAt

**AuditLog**
- id (UUID)
- actorId (user who performed action)
- action (e.g., "registration.create", "certificate.issue")
- entityType, entityId
- createdAt

## Authentication Flow

```
┌─────────┐                  ┌─────────┐                ┌──────────┐
│ Client  │                  │ Backend │                │ Database │
└────┬────┘                  └────┬────┘                └────┬─────┘
     │                            │                          │
     │ POST /auth/login           │                          │
     │ { email, password }        │                          │
     ├───────────────────────────>│                          │
     │                            │ findOne(email)           │
     │                            ├─────────────────────────>│
     │                            │<─────────────────────────┤
     │                            │ bcrypt.compare(password) │
     │                            │                          │
     │                            │ jwt.sign(payload)        │
     │<───────────────────────────┤                          │
     │ { accessToken, member }    │                          │
     │                            │                          │
     │ Store token in localStorage│                          │
     │                            │                          │
     │ Subsequent requests        │                          │
     │ Authorization: Bearer <token>                         │
     ├───────────────────────────>│                          │
     │                            │ JwtStrategy validates    │
     │                            │ RolesGuard checks role   │
     │<───────────────────────────┤                          │
```

## Registration & Certificate Flow

```
1. User registers for event:
   POST /registrations/:eventId/member/:memberId
   → Check event capacity (< maxRegistrations)
   → Assign sequentialCode = currentCount + 1
   → Create Registration record
   → Log: "registration.create"

2. Staff marks attendance:
   POST /attendance/mark/:eventId/member/:memberId
   → Create Attendance record (UNIQUE constraint)
   → Log: "attendance.mark"

3. Staff issues certificate:
   POST /certificates/issue/:registrationId
   → Generate QR code: "{registrationId}|{sequentialCode}"
   → Render HTML template with member name, event title, QR image
   → Puppeteer: HTML → PDF (saved to /certificates dir)
   → Create Certificate record with filePath
   → Log: "certificate.issue"

4. Anyone verifies certificate:
   GET /certificates/verify/:registrationId?code=X
   → Check if Registration.sequentialCode == X
   → Return { valid: true/false }
```

## Security Considerations

- **Authentication:** JWT tokens (24h expiry)
- **Password Storage:** bcrypt hash (10 rounds)
- **Role-Based Access:** Guards enforce admin/staff/participant permissions
- **Audit Trail:** All critical actions logged indefinitely
- **Input Validation:** NestJS ValidationPipe + DTOs
- **SQL Injection:** TypeORM parameterized queries
- **CORS:** Configure allowed origins in production

## Scalability & Performance

- **Current:** SQLite (single file, ≤50 registrations/event)
- **Bottleneck:** Synchronous PDF generation (Puppeteer)
- **Mitigation:** Queue-based certificate generation (BullMQ + Redis) for scale
- **Migration Path:** Azure Cosmos DB for multi-region, high-availability

## Deployment

### Development
- Backend: `npm run start:dev` (port 3000)
- Frontend: `npm start` (port 4200)

### Production
- Backend: `npm run build && node dist/main.js`
- Frontend: `npm run build` → serve `dist/frontend/browser` (Nginx, Azure Static Web Apps, etc.)
- Environment: Set `JWT_SECRET`, configure CORS, Puppeteer Chrome path

## Monitoring & Observability

- **Logs:** Console logs (stdout/stderr)
- **API Docs:** Swagger UI at `/api/docs`
- **Audit:** Query `/audit` endpoint (admin/staff only)
- **Health Check:** TODO: Add `/health` endpoint

## Future Enhancements

- [ ] Email notifications (registration confirmation, certificate ready)
- [ ] Bulk import members (CSV)
- [ ] Export registrations/attendance (Excel)
- [ ] Certificate templates (customizable per event)
- [ ] Real-time attendance dashboard (WebSockets)
- [ ] Azure Cosmos DB migration
- [ ] Docker Compose for local dev
- [ ] CI/CD pipeline (GitHub Actions / Azure DevOps)
