# Database Schema

Complete documentation of the JoinUp database structure, entities, and relationships.

---

## Database Overview

**Type**: SQLite  
**File**: `backend/data.sqlite`  
**ORM**: TypeORM  
**Relationships**: Relational with foreign keys

---

## Entity Diagram

```
Member (Users)
├── id (PK)
├── email (UNIQUE)
├── name
├── password (hashed)
├── birthDate
├── gender
├── role (enum: participant, staff, admin)
├── createdAt
└── updatedAt

Event
├── id (PK)
├── title
├── description
├── location
├── startDate
├── endDate
├── capacity
├── categories (JSON array)
├── price
├── createdBy (FK → Member.id)
├── createdAt
└── updatedAt

Registration
├── id (PK)
├── memberId (FK → Member.id)
├── eventId (FK → Event.id)
├── registeredAt
└── status

Attendance
├── id (PK)
├── memberId (FK → Member.id)
├── eventId (FK → Event.id)
├── attended (boolean)
└── markedAt

Certificate
├── id (PK)
├── registrationId (FK → Registration.id)
├── memberId (FK → Member.id)
├── eventId (FK → Event.id)
├── certificateCode (UNIQUE)
├── pdfUrl
├── qrCode
├── issuedAt
└── expiresAt

AuditLog
├── id (PK)
├── timestamp
├── action
├── entityType
├── entityId
├── userId (FK → Member.id, nullable)
├── userName
└── details (JSON)
```

---

## Core Entities

### Member Entity

**Table**: `member`

| Column | Type | Nullable | Unique | Default | Description |
|--------|------|----------|--------|---------|-------------|
| id | INT | NO | YES | Auto-increment | Primary key |
| email | VARCHAR | NO | YES | - | User's email (login credential) |
| name | VARCHAR | NO | NO | - | User's full name |
| password | VARCHAR | NO | NO | - | Bcrypt hashed password |
| birthDate | DATE | NO | NO | - | User's birth date |
| gender | ENUM | NO | NO | - | 'male', 'female', 'other', 'prefer_not_to_say' |
| role | ENUM | NO | NO | 'participant' | 'participant', 'staff', 'admin' |
| createdAt | TIMESTAMP | NO | NO | CURRENT_TIMESTAMP | Account creation date |
| updatedAt | TIMESTAMP | NO | NO | CURRENT_TIMESTAMP | Last update date |

**Indexes**:
- PRIMARY KEY (id)
- UNIQUE KEY (email)
- INDEX (role)

**Constraints**:
- Email format validation
- Unique email per system
- Role must be one of: participant, staff, admin

**Relationships**:
- 1:N → Registration
- 1:N → Attendance
- 1:N → Certificate
- 1:N → AuditLog

---

### Event Entity

**Table**: `event`

| Column | Type | Nullable | Unique | Default | Description |
|--------|------|----------|--------|---------|-------------|
| id | INT | NO | YES | Auto-increment | Primary key |
| title | VARCHAR | NO | NO | - | Event name |
| description | TEXT | YES | NO | - | Event details |
| location | VARCHAR | YES | NO | - | Event location |
| startDate | TIMESTAMP | NO | NO | - | Event start time |
| endDate | TIMESTAMP | NO | NO | - | Event end time |
| capacity | INT | NO | NO | - | Maximum participants |
| categories | JSON | YES | NO | '[]' | Array of categories |
| price | DECIMAL | NO | NO | 0 | Event cost (0 = free) |
| createdBy | INT | NO | NO | - | Admin/staff who created |
| createdAt | TIMESTAMP | NO | NO | CURRENT_TIMESTAMP | Creation date |
| updatedAt | TIMESTAMP | NO | NO | CURRENT_TIMESTAMP | Last update date |

**Valid Categories**:
- 'conference'
- 'workshop'
- 'meetup'
- 'webinar'

**Indexes**:
- PRIMARY KEY (id)
- FOREIGN KEY (createdBy) → Member.id
- INDEX (startDate)
- INDEX (endDate)
- INDEX (createdBy)

**Constraints**:
- endDate must be after startDate
- capacity must be > 0
- price must be >= 0

**Relationships**:
- N:1 ← Member (createdBy)
- 1:N → Registration
- 1:N → Attendance
- 1:N → Certificate

---

### Registration Entity

**Table**: `registration`

| Column | Type | Nullable | Unique | Default | Description |
|--------|------|----------|--------|---------|-------------|
| id | INT | NO | YES | Auto-increment | Primary key |
| memberId | INT | NO | NO | - | Registered member |
| eventId | INT | NO | NO | - | Event registered for |
| registeredAt | TIMESTAMP | NO | NO | CURRENT_TIMESTAMP | Registration date/time |
| status | VARCHAR | NO | NO | 'registered' | Current status |

**Valid Status Values**:
- 'registered'
- 'cancelled'
- 'attended'
- 'no-show'

**Indexes**:
- PRIMARY KEY (id)
- FOREIGN KEY (memberId) → Member.id
- FOREIGN KEY (eventId) → Event.id
- UNIQUE KEY (memberId, eventId) - Prevent duplicate registrations
- INDEX (eventId)
- INDEX (registeredAt)

**Constraints**:
- Unique combination of memberId + eventId (one registration per member per event)
- memberId must exist in Member table
- eventId must exist in Event table
- ON DELETE CASCADE: If member or event deleted, registration deleted
- Event must not have started at registration time

**Relationships**:
- N:1 ← Member (memberId)
- N:1 ← Event (eventId)
- 1:1 → Certificate (optional)

---

### Attendance Entity

**Table**: `attendance`

| Column | Type | Nullable | Unique | Default | Description |
|--------|------|----------|--------|---------|-------------|
| id | INT | NO | YES | Auto-increment | Primary key |
| memberId | INT | NO | NO | - | Attendee member |
| eventId | INT | NO | NO | - | Event attended |
| attended | BOOLEAN | NO | NO | false | Presence status |
| markedAt | TIMESTAMP | NO | NO | CURRENT_TIMESTAMP | When marked |

**Indexes**:
- PRIMARY KEY (id)
- FOREIGN KEY (memberId) → Member.id
- FOREIGN KEY (eventId) → Event.id
- UNIQUE KEY (memberId, eventId) - One attendance record per member per event
- INDEX (eventId)
- INDEX (attended)

**Constraints**:
- Unique combination of memberId + eventId
- Member must be registered for event (optional constraint, recommended)
- ON DELETE CASCADE: If member or event deleted, attendance deleted

**Relationships**:
- N:1 ← Member (memberId)
- N:1 ← Event (eventId)

---

### Certificate Entity

**Table**: `certificate`

| Column | Type | Nullable | Unique | Default | Description |
|--------|------|----------|--------|---------|-------------|
| id | INT | NO | YES | Auto-increment | Primary key |
| registrationId | INT | NO | YES | - | Associated registration |
| memberId | INT | NO | NO | - | Certificate recipient |
| eventId | INT | NO | NO | - | Event certificate for |
| certificateCode | VARCHAR | NO | YES | - | Unique certificate ID |
| pdfUrl | VARCHAR | YES | NO | - | Path to PDF file |
| qrCode | VARCHAR | YES | NO | - | QR code data/image |
| issuedAt | TIMESTAMP | NO | NO | CURRENT_TIMESTAMP | Issue date |
| expiresAt | TIMESTAMP | YES | NO | NULL | Expiration date (if applicable) |

**Certificate Code Format**: `CERT-YYYY-NNNNN` (e.g., CERT-2025-00123)

**Indexes**:
- PRIMARY KEY (id)
- FOREIGN KEY (registrationId) → Registration.id
- FOREIGN KEY (memberId) → Member.id
- FOREIGN KEY (eventId) → Event.id
- UNIQUE KEY (certificateCode)
- UNIQUE KEY (registrationId) - One certificate per registration
- INDEX (memberId)
- INDEX (eventId)
- INDEX (issuedAt)

**Constraints**:
- Unique certificateCode (prevents duplicate certificates)
- registrationId must exist and be unique (one cert per registration)
- Member must have attended event before certificate issued
- Event must be completed before certificate issued
- ON DELETE CASCADE for all foreign keys

**Relationships**:
- 1:1 ← Registration (registrationId)
- N:1 ← Member (memberId)
- N:1 ← Event (eventId)

---

### AuditLog Entity

**Table**: `audit_log`

| Column | Type | Nullable | Unique | Default | Description |
|--------|------|----------|--------|---------|-------------|
| id | INT | NO | YES | Auto-increment | Primary key |
| timestamp | TIMESTAMP | NO | NO | CURRENT_TIMESTAMP | When action occurred |
| action | VARCHAR | NO | NO | - | Action type |
| entityType | VARCHAR | NO | NO | - | What entity was affected |
| entityId | INT | YES | NO | - | ID of affected entity |
| userId | INT | YES | NO | NULL | Who performed action |
| userName | VARCHAR | YES | NO | - | Name of user who acted |
| details | JSON | YES | NO | '{}' | Additional context |

**Valid Actions**:
- 'create'
- 'update'
- 'delete'
- 'login'
- 'logout'
- 'changeRole'
- 'issueC certificate'
- 'markAttendance'

**Valid Entity Types**:
- 'member'
- 'event'
- 'registration'
- 'attendance'
- 'certificate'
- 'auth'

**Indexes**:
- PRIMARY KEY (id)
- FOREIGN KEY (userId) → Member.id (nullable)
- INDEX (timestamp)
- INDEX (entityType)
- INDEX (action)
- INDEX (userId)

**Constraints**:
- userId can be NULL (system actions)
- Details stored as JSON for flexibility
- Permanent retention (no cleanup)
- ON DELETE SET NULL: If user deleted, userId becomes NULL

**Relationships**:
- N:1 ← Member (userId, optional)

---

## Relationships & Cardinality

### Member → Registration (1:N)

- One member can have many registrations
- Each registration belongs to one member
- Delete member → cascading delete registrations

### Event → Registration (1:N)

- One event can have many registrations
- Each registration is for one event
- Delete event → cascading delete registrations

### Registration → Certificate (1:1)

- One registration has at most one certificate
- One certificate belongs to one registration
- Delete registration → cascading delete certificate

### Member → Attendance (1:N)

- One member can have many attendance records
- Each attendance record is for one member
- Delete member → cascading delete attendance

### Event → Attendance (1:N)

- One event can have many attendance records
- Each attendance is for one event
- Delete event → cascading delete attendance

### Member → AuditLog (1:N, optional)

- One member can have many audit logs
- Each audit log can reference one member (optional)
- Delete member → set audit log userId to NULL

---

## Query Patterns

### Get Event with Registrations

```sql
SELECT e.*, r.id, r.memberId, m.name, m.email
FROM event e
LEFT JOIN registration r ON e.id = r.eventId
LEFT JOIN member m ON r.memberId = m.id
WHERE e.id = ?
```

### Get Member's Registered Events

```sql
SELECT DISTINCT e.*
FROM event e
INNER JOIN registration r ON e.id = r.eventId
WHERE r.memberId = ?
```

### Get Attendance for Event

```sql
SELECT m.id, m.name, m.email, a.attended, a.markedAt
FROM member m
INNER JOIN registration r ON m.id = r.memberId
LEFT JOIN attendance a ON m.id = a.memberId AND a.eventId = ?
WHERE r.eventId = ?
```

### Get Event Capacity Status

```sql
SELECT e.id, e.title, e.capacity,
       COUNT(r.id) as registeredCount,
       (e.capacity - COUNT(r.id)) as availableSpots
FROM event e
LEFT JOIN registration r ON e.id = r.eventId
WHERE e.id = ?
GROUP BY e.id
```

### Get Certificate Issued Count

```sql
SELECT e.id, e.title, COUNT(c.id) as certificatesIssued
FROM event e
LEFT JOIN certificate c ON e.id = c.eventId
WHERE e.startDate >= ? AND e.endDate <= ?
GROUP BY e.id
```

---

## Data Integrity & Constraints

### Referential Integrity

All foreign key relationships enforce referential integrity:
- Child records cannot reference non-existent parent
- Cascade delete on parent deletion (except AuditLog)
- Cascade update on parent ID change

### Business Rule Constraints

1. **Event Dates**: endDate > startDate (enforced in service)
2. **Registration**: Only possible before event starts (enforced in service)
3. **Attendance**: Only marked for registered members (enforced in service)
4. **Certificate**: Only issued to attendees of completed events (enforced in service)
5. **Unique Registrations**: One member cannot register twice for same event
6. **Unique Attendance**: One record per member per event

### Data Validation

Validated at DTO/service layer before database insert:
- Email format and uniqueness
- Password hashing and strength
- Gender enum validation
- Role enum validation
- Category enum validation
- Date/time format and logic
- Numeric constraints (capacity > 0, price >= 0)

---

## Migrations & Schema Evolution

### Current Version

JoinUp uses TypeORM with synchronize mode enabled in development. For production:

1. Create migration files: `npm run typeorm migration:generate`
2. Apply migrations: `npm run typeorm migration:run`
3. Revert if needed: `npm run typeorm migration:revert`

### Migration Example

```typescript
export class CreateMemberTable1702000000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'member',
        columns: [
          { name: 'id', type: 'integer', isPrimary: true },
          { name: 'email', type: 'varchar', isUnique: true },
          // ... more columns
        ],
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('member');
  }
}
```

---

## Backup & Recovery

### Backup Database

```bash
cp backend/data.sqlite backup/data.sqlite.$(date +%Y%m%d)
```

### Restore Database

```bash
cp backup/data.sqlite.20251210 backend/data.sqlite
npm run start:dev  # Restart to reload
```

### Export as JSON

```bash
# Use API endpoints to export data
GET /events → save JSON
GET /auth/members → save JSON
GET /audit → save JSON
```

---

## Performance Optimization

### Current Indexes

- Primary keys on all entities
- Foreign keys for join optimization
- Timestamp columns for range queries
- Entity type and action for audit queries

### Future Optimization Opportunities

1. **Composite Indexes**: (eventId, registeredAt) for registration queries
2. **Full-Text Search**: On event title and description
3. **Partitioning**: AuditLog by year for large datasets
4. **Caching Layer**: Redis for frequently accessed data
5. **Database**: Consider PostgreSQL for high concurrency

---

## Related Documentation

- [Architecture Overview](./09-Architecture.md)
- [API Reference](./10-API-Reference.md)
- [Event Management](./04-Event-Management.md)
- [Testing Guide](./13-Testing-Guide.md)

---

**Need help?** Check [Troubleshooting - Database](./15-Troubleshooting.md#database-issues)
