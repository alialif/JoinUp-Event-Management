# Quick Start Guide

Get JoinUp running in 5 minutes!

---

## One-Command Setup

### Backend

```bash
cd backend && npm install && npm run seed && npm run start:dev
```

### Frontend (in a new terminal)

```bash
cd frontend && npm install && npm start
```

---

## Access the Application

Once both servers are running:

- **Frontend**: http://localhost:4200
- **Backend API**: http://localhost:3000
- **API Docs**: http://localhost:3000/api/docs

---

## Login with Test Credentials

Choose a user role to log in:

### Admin Account
```
Email: admin@bootcamp.com
Password: admin123
```
**Capabilities:**
- Create and manage events
- Manage user roles
- View audit logs
- Mark attendance
- Issue certificates

### Staff Account
```
Email: staff@bootcamp.com
Password: staff123
```
**Capabilities:**
- Create and manage events
- Mark attendance
- Issue certificates
- View event details

### Participant Account
```
Email: participant1@bootcamp.com
Password: participant123
```
**Capabilities:**
- Register for events
- View registered events
- Download certificates
- View personal profile

---

## Basic Workflows

### As a Participant

1. **Register for an Event**
   - Login as participant
   - Navigate to Events
   - Click "View" on any event that hasn't started
   - Click "Register"
   - Confirmation message appears

2. **Download Certificate** (after event ends)
   - Go to Events list
   - Find a finished event you registered for
   - Click "Certificate" button
   - PDF downloads to your computer

### As Staff/Admin

1. **Create an Event**
   - Login as staff or admin
   - Click "Create Event" button
   - Fill in event details:
     - Title and description
     - Start and end dates
     - Maximum capacity
     - Categories (Conference, Workshop, Meetup, Webinar)
     - Price (Free or Paid)
   - Click "Create"

2. **Mark Attendance**
   - Go to event detail page
   - Click "Attendance" tab
   - Toggle checkboxes next to participant names
   - Changes save automatically

3. **Issue Certificates**
   - Go to event detail page
   - Click "Certificates" tab
   - Click "Issue" button for each participant
   - PDF certificate with QR code is generated

### As Admin Only

1. **Manage User Roles**
   - Click "Users" in sidebar
   - See all registered users
   - Use dropdown menu to change roles:
     - Participant → Staff
     - Staff → Admin
     - Admin → Participant
   - Changes apply immediately

---

## Common Commands

### Start Development Servers

```bash
# Terminal 1: Backend
cd backend && npm run start:dev

# Terminal 2: Frontend
cd frontend && npm start
```

### Run Tests

```bash
# Backend unit tests
cd backend && npm test

# Backend E2E tests
cd backend && npm run test:e2e

# Frontend unit tests
cd frontend && npm test

# Frontend E2E tests (Cypress)
cd frontend && npm run e2e
```

### Build for Production

```bash
# Backend
cd backend && npm run build

# Frontend
cd frontend && npm run build
```

---

## Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+

---

## Language Support

The application supports:
- **English** (en)
- **French Canadian** (fr-CA)

Switch languages using the language selector in the header.

---

## What's Next?

- **Learn Features**: Read [Event Management](./04-Event-Management.md)
- **Understand Architecture**: Check [Architecture Guide](./09-Architecture.md)
- **Run Tests**: See [Testing Guide](./13-Testing-Guide.md)
- **Explore API**: Visit [API Reference](./10-API-Reference.md)

---

**Getting stuck?** Check [Troubleshooting](./15-Troubleshooting.md) for help.
