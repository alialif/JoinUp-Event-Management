# Installation & Setup Guide

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** 20 or higher
- **npm** 10 or higher
- **Git** (for version control)
- **SQLite** (included with NestJS for database)

### Verify Installation

```bash
node --version    # Should be v20.x.x or higher
npm --version     # Should be v10.x.x or higher
git --version     # Should show git version
```

---

## Backend Setup

### 1. Install Dependencies

```bash
cd backend
npm install
```

### 2. Seed Database (Optional but Recommended)

This creates a SQLite database with test data including users and sample events:

```bash
npm run seed
```

**Default Test Users Created:**
- Admin: `admin@bootcamp.com` / `admin123`
- Staff: `staff@bootcamp.com` / `staff123`
- Participant: `participant1@bootcamp.com` / `participant123`

### 3. Start Development Server

```bash
npm run start:dev
```

The backend will be available at: **http://localhost:3000**

### API Documentation

Once the server is running, view the Swagger UI documentation:
- **URL**: http://localhost:3000/api/docs
- Complete list of all endpoints
- Try requests directly in the UI

---

## Frontend Setup

### 1. Install Dependencies

```bash
cd frontend
npm install
```

### 2. Start Development Server

```bash
npm start
```

The frontend will be available at: **http://localhost:4200**

### 3. Build for Production

```bash
npm run build
```

Output files will be in `dist/frontend/`

---

## Database Configuration

The backend uses SQLite by default, which creates a `data.sqlite` file in the `backend` directory.

### Resetting the Database

To reset and re-seed the database:

```bash
cd backend
rm data.sqlite        # Delete the database file
npm run seed          # Create and seed a fresh database
npm run start:dev     # Restart the server
```

---

## Troubleshooting Setup Issues

### Port Already in Use

**Frontend (port 4200):**
```bash
npm start -- --port 4300
```

**Backend (port 3000):**
```bash
# Edit backend/src/main.ts or use PORT environment variable
PORT=3001 npm run start:dev
```

### Module Not Found Errors

Try cleaning and reinstalling:

```bash
# For frontend
cd frontend
rm -rf node_modules package-lock.json dist
npm install

# For backend
cd backend
rm -rf node_modules package-lock.json dist
npm install
```

### Build Errors on macOS

If you see Windows-specific dependency errors:

1. Remove platform-specific packages from `package.json`
2. Clear npm cache: `npm cache clean --force`
3. Reinstall: `npm install`

---

## Environment Variables

### Backend (`backend/.env`)

```env
JWT_SECRET=your-jwt-secret-key-here
PUPPETEER_EXECUTABLE_PATH=     # Optional: custom Chrome path
DATABASE_URL=sqlite:data.sqlite
```

### Frontend (`frontend/.env`)

```env
NG_APP_API_URL=http://localhost:3000
```

---

## Verify Installation

Once everything is set up, verify both servers are running:

1. **Backend**: Visit http://localhost:3000/api/docs
   - You should see the Swagger API documentation

2. **Frontend**: Visit http://localhost:4200
   - You should see the login page with the JoinUp logo

3. **Login**: Use test credentials from the seeding step

---

## Next Steps

Once you have everything running:

1. Read the [Quick Start Guide](./02-Quick-Start.md) to understand the app
2. Check [User Roles & Permissions](./03-User-Roles.md) to learn about different user types
3. Explore [Feature Documentation](./04-Event-Management.md) for specific features

---

**Need Help?** See [Troubleshooting](./15-Troubleshooting.md) for common issues.
