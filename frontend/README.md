# Frontend - Bootcamp Management Application

Angular 20+ frontend with bilingual support, role-based access, and integrated authentication.

## Tech Stack

- **Framework:** Angular 20+ (zoneless change detection, standalone components)
- **HTTP Client:** Angular HttpClient with JWT interceptor
- **Internationalization:** ngx-translate (English, French-Canadian)
- **Routing:** Angular Router with role-based guards
- **Styling:** Custom CSS with CGI-inspired theme
- **Testing:** Jasmine + Karma (unit), Cypress (e2e)

## Features

### Authentication & Authorization
- Login/logout with JWT tokens
- Role-based access control (admin, staff, participant)
- Protected routes via `authGuard`
- Automatic token injection via HTTP interceptor

### Event Management
- **Events List:** View all events with current registration capacity
- **Event Detail:** View event information, register for events
- **Registration:** One-click registration with capacity enforcement
- **Already Registered Detection:** Prevents duplicate registrations

### Staff/Admin Features
- **Attendance Marking:** Mark participant attendance from event detail
- **Certificate Issuance:** Generate PDF certificates with QR codes
- **Role-Based UI:** Management links visible only to staff/admin

### User Experience
- **Bilingual Interface:** Switch between English and French-Canadian
- **Loading Spinner:** Global HTTP request indicator
- **Toast Notifications:** Error and success messages
- **Responsive Design:** Works on desktop and mobile devices

## Getting Started

### Prerequisites
- Node.js 20+
- npm 10+
- Backend running on `http://localhost:3000`

### Installation

```bash
cd frontend
npm install
```

### Development Server

Start the development server:

```bash
npm start
```

Navigate to `http://localhost:4200/`. The app will automatically reload when you modify source files.

### Default Login Credentials

Login at `/login` with these seeded accounts:

| Role        | Email                          | Password         |
|-------------|--------------------------------|------------------|
| Admin       | admin@bootcamp.com             | admin123         |
| Staff       | staff@bootcamp.com             | staff123         |
| Participant | participant1@bootcamp.com      | participant123   |

## Application Structure

```
frontend/src/app/
├── core/                      # Core services & models
│   ├── api.service.ts         # HTTP API client
│   ├── auth.service.ts        # Authentication logic
│   ├── auth.guard.ts          # Route protection
│   ├── auth.interceptor.ts    # JWT token injection + loading/error handling
│   ├── has-role.directive.ts  # Role-based element visibility
│   ├── loading.service.ts     # Global loading state
│   ├── toast.service.ts       # Toast notifications
│   └── models.ts              # TypeScript interfaces
├── features/                  # Feature modules
│   ├── login/                 # Login component
│   ├── shell/                 # App layout (header, nav, outlet)
│   ├── events/
│   │   ├── events-list.component.ts    # Events list view
│   │   └── event-detail.component.ts   # Event detail + registration
│   ├── attendance/            # Attendance marking (staff/admin)
│   └── certificates/          # Certificate issuance (staff/admin)
├── shared/                    # Shared components
│   ├── spinner.component.ts   # Loading spinner
│   └── toast-container.component.ts  # Toast notifications
└── assets/i18n/
    ├── en.json                # English translations
    └── fr-CA.json             # French-Canadian translations
```

## User Flows

### 1. Login Flow
1. Navigate to `/login`
2. Enter email and password
3. Submit form
4. Redirected to `/events` on success

### 2. Event Registration (Participant)
1. Login as participant
2. View events list at `/events`
3. Click **View** on desired event
4. Click **Register** button
5. See success message
6. Button disabled showing "You are already registered"

### 3. Attendance Marking (Staff/Admin)
1. Login as staff or admin
2. Navigate to event detail
3. Click **Attendance** link (visible only to staff/admin)
4. See list of registered participants
5. Click **Mark Attendance** for each participant
6. Button disabled after marking

### 4. Certificate Issuance (Staff/Admin)
1. Login as staff or admin
2. Navigate to event detail
3. Click **Certificates** link
4. See list of registrations
5. Click **Issue Certificate**
6. PDF download link appears

### 5. Language Switching
1. Click language dropdown in header
2. Select `en` or `fr-CA`
3. All UI text updates immediately
4. Preference saved to localStorage

## Testing

### Unit Tests (Jasmine + Karma)

Run unit tests:

```bash
npm test
```

Coverage includes:
- `LoginComponent`: Form validation, auth service interaction, error handling
- `EventsListComponent`: Event loading, capacity calculation, registration logic

### E2E Tests (Cypress)

Open Cypress test runner:

```bash
npm run e2e
```

Run headless:

```bash
npm run e2e:headless
```

Test scenarios:
- **Auth Flow:** Login, logout, invalid credentials
- **Registration Flow:** View events, navigate detail, register, prevent duplicates
- **Certificate Flow:** Access management links, mark attendance, issue certificates

## Building for Production

Build the project:

```bash
npm run build
```

Build artifacts are stored in `dist/frontend/browser/`.

Serve with any static file server:

```bash
npx serve dist/frontend/browser
```

## API Integration

The frontend communicates with the NestJS backend at `http://localhost:3000`.

### Key API Methods (ApiService)

```typescript
// Events
getEvents(): Observable<Event[]>
getEvent(id: string): Observable<Event>

// Registrations
register(eventId: string, memberId: string): Observable<Registration>
getEventRegistrations(eventId: string): Observable<Registration[]>

// Attendance
markAttendance(eventId: string, memberId: string): Observable<Attendance>
getEventAttendance(eventId: string): Observable<Attendance[]>

// Certificates
issueCertificate(registrationId: string): Observable<Certificate>
verifyCertificate(registrationId: string, code: number): Observable<{ valid: boolean }>
```

### HTTP Interceptor Features

The `authInterceptor` automatically:
- Injects JWT token into `Authorization` header
- Shows global loading spinner during requests
- Displays error toasts on HTTP failures
- Hides spinner when request completes

## Internationalization (i18n)

Translation keys are organized by feature:

```json
{
  "app": { "title", "logout" },
  "auth": { "email", "password", "loginButton" },
  "events": { "title", "register", "capacity", "view" },
  "attendance": { "markAttendance" },
  "certificates": { "issueCertificate" },
  "common": { "loading", "error", "success" }
}
```

Use in templates:

```html
{{ 'events.title' | translate }}
```

## Styling

Global theme defined in `src/styles.scss`:

- **CSS Variables:** `--color-accent`, `--color-border`, `--radius-sm`
- **Utility Classes:** `.btn`, `.card`, `.table`, `.spinner`, `.toast`
- **CGI-Inspired:** Professional, minimal, accessible design

## Troubleshooting

### Backend Not Running
**Error:** HTTP requests fail with network error  
**Solution:** Start backend with `cd backend && npm run start:dev`

### Token Expired
**Error:** 401 Unauthorized after inactivity  
**Solution:** Logout and login again (JWT expires after 24h)

### Translation Keys Missing
**Error:** Raw key displayed instead of translated text  
**Solution:** Add key to both `en.json` and `fr-CA.json`

### Tests Failing
**Error:** "Can't resolve '@ngx-translate/core'"  
**Solution:** Run `npm install` to ensure all dependencies installed

## Additional Resources

- [Angular Documentation](https://angular.dev)
- [ngx-translate](https://github.com/ngx-translate/core)
- [Cypress E2E Testing](https://www.cypress.io)
- [Backend API Docs](http://localhost:3000/api/docs)
