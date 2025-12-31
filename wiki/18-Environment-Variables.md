# Environment Variables Configuration

Guide to environment variables and configuration for JoinUp.

---

## Overview

Environment variables allow configuring JoinUp for different environments (development, testing, production) without changing code.

---

## Backend Configuration

### `.env` File Location

```
backend/.env
```

### Creating `.env` File

```bash
cd backend
cat > .env << EOF
JWT_SECRET=your-secret-key-change-me
PUPPETEER_EXECUTABLE_PATH=
NODE_ENV=development
PORT=3000
DATABASE_URL=sqlite:data.sqlite
EOF
```

### Required Variables

#### JWT_SECRET (REQUIRED)

**Purpose**: Secret key for signing JWT tokens

**Format**: Long random string (min 32 characters)

**Example**:
```env
JWT_SECRET=aB3$xYz9@kL2#mN5!pQ8&rS1%tU4^vW7
```

**Generate Strong Key**:
```bash
# macOS/Linux
openssl rand -base64 32

# Or use Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

**Security Note**: 
- Never commit to version control
- Use different key per environment
- Change if compromised

---

#### NODE_ENV

**Purpose**: Application environment

**Values**:
- `development` - Local development (hot reload, verbose logging)
- `test` - Testing environment (use test database)
- `production` - Production deployment

**Example**:
```env
NODE_ENV=development
```

**Default**: `development`

---

#### PORT

**Purpose**: HTTP server port

**Example**:
```env
PORT=3000
```

**Default**: `3000`

**Production Note**: Consider using 80 or 443 with reverse proxy

---

#### DATABASE_URL

**Purpose**: Database connection string

**SQLite Format**:
```env
DATABASE_URL=sqlite:data.sqlite
DATABASE_URL=sqlite:./database/data.sqlite
```

**PostgreSQL Format** (for production):
```env
DATABASE_URL=postgresql://user:password@localhost:5432/joinup_db
```

**Default**: `sqlite:data.sqlite`

---

#### PUPPETEER_EXECUTABLE_PATH

**Purpose**: Path to Chrome/Chromium executable

**When Needed**: If Chrome not in standard location

**Example**:
```env
# macOS
PUPPETEER_EXECUTABLE_PATH=/Applications/Google\ Chrome.app/Contents/MacOS/Google\ Chrome

# Linux
PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium

# Windows
PUPPETEER_EXECUTABLE_PATH="C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe"
```

**Default**: Empty (auto-detect)

---

### Optional Variables

#### LOG_LEVEL

**Purpose**: Logging verbosity

**Values**: `verbose`, `debug`, `log`, `warn`, `error`

**Example**:
```env
LOG_LEVEL=debug
```

**Default**: `log`

---

#### CORS_ORIGIN

**Purpose**: Allowed origins for CORS

**Example**:
```env
CORS_ORIGIN=http://localhost:4200,https://yourdomain.com
```

**Default**: `http://localhost:4200`

---

#### API_PREFIX

**Purpose**: Base path for API routes

**Example**:
```env
API_PREFIX=/api/v1
```

**Default**: `/api`

---

### Environment-Specific Examples

#### Development

```env
# backend/.env
NODE_ENV=development
JWT_SECRET=dev-secret-key-change-in-production
PORT=3000
DATABASE_URL=sqlite:data.sqlite
LOG_LEVEL=debug
PUPPETEER_EXECUTABLE_PATH=
```

#### Testing

```env
# backend/.env.test
NODE_ENV=test
JWT_SECRET=test-secret-key
PORT=3001
DATABASE_URL=sqlite:test.sqlite
LOG_LEVEL=error
```

#### Production

```env
# backend/.env.production (DO NOT COMMIT)
NODE_ENV=production
JWT_SECRET=use-strong-random-key-here
PORT=3000
DATABASE_URL=postgresql://user:securepass@db-host:5432/joinup
LOG_LEVEL=warn
PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium
```

---

## Frontend Configuration

### Environment Files Location

```
frontend/src/environments/
├── environment.ts       # Development
└── environment.prod.ts  # Production
```

### Development Environment

**File**: `frontend/src/environments/environment.ts`

```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:3000',
  appName: 'JoinUp',
  version: '1.0.0',
};
```

### Production Environment

**File**: `frontend/src/environments/environment.prod.ts`

```typescript
export const environment = {
  production: true,
  apiUrl: 'https://api.joinup.com',
  appName: 'JoinUp',
  version: '1.0.0',
};
```

### Configuration Options

#### apiUrl (REQUIRED)

**Purpose**: Backend API base URL

**Example**:
```typescript
apiUrl: 'http://localhost:3000'        // Development
apiUrl: 'https://api.joinup.com'       // Production
```

#### production

**Purpose**: Marks production build

**Values**: `true` or `false`

```typescript
production: false   // Development
production: true    // Production
```

#### appName

**Purpose**: Application display name

```typescript
appName: 'JoinUp'
```

#### version

**Purpose**: Application version

```typescript
version: '1.0.0'
```

---

### Using Environment Variables in Frontend

**In Typescript**:
```typescript
import { environment } from '../../environments/environment';

const apiUrl = environment.apiUrl;  // 'http://localhost:3000'
```

**In Templates**:
```html
<!-- Not directly available in templates, use component properties -->
<div>{{ apiUrl }}</div>

<!-- In component.ts -->
export class MyComponent {
  apiUrl = environment.apiUrl;
}
```

---

## Build Configuration

### Building with Environment

**Development Build**:
```bash
npm start   # Uses environment.ts
```

**Production Build**:
```bash
npm run build
# Automatically uses environment.prod.ts
```

### Specifying Environment

```bash
# Frontend
ng serve --configuration=development
ng build --configuration=production

# Backend
NODE_ENV=production npm run build
```

---

## Docker Configuration

### Docker Environment Variables

```dockerfile
FROM node:20

ENV NODE_ENV=production
ENV PORT=3000
ENV JWT_SECRET=${JWT_SECRET}
ENV DATABASE_URL=postgresql://...

CMD ["node", "dist/main.js"]
```

### Running with Docker

```bash
docker run \
  -e JWT_SECRET=your-secret-key \
  -e DATABASE_URL=postgresql://... \
  -e NODE_ENV=production \
  -p 3000:3000 \
  joinup-api
```

---

## Secrets Management

### Best Practices

1. **Never commit secrets to version control**
   ```bash
   # In .gitignore
   .env
   .env.local
   .env.*.local
   ```

2. **Use `.env.example` for documentation**
   ```bash
   # .env.example
   JWT_SECRET=change_me_in_production
   DATABASE_URL=sqlite:data.sqlite
   PORT=3000
   ```

3. **Different secrets per environment**
   ```
   Development: local .env file
   Staging: ENV vars from CI/CD
   Production: secrets manager (AWS Secrets, HashiCorp Vault, etc.)
   ```

4. **Rotate secrets regularly**
   - Change JWT_SECRET periodically
   - Update database passwords
   - Invalidate exposed keys

---

## CI/CD Integration

### GitHub Actions Example

```yaml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node
        uses: actions/setup-node@v3
        with:
          node-version: '20'
      
      - name: Deploy Backend
        env:
          JWT_SECRET: ${{ secrets.JWT_SECRET }}
          DATABASE_URL: ${{ secrets.DATABASE_URL }}
          NODE_ENV: production
        run: |
          cd backend
          npm install
          npm run build
          npm run start:prod
      
      - name: Deploy Frontend
        run: |
          cd frontend
          npm install
          npm run build
```

### Environment Secrets in GitHub

1. Go to repo Settings → Secrets and variables → Actions
2. Click "New repository secret"
3. Add secrets:
   - JWT_SECRET
   - DATABASE_URL
   - API_URL
   - etc.

---

## Local Development Setup

### Quick Setup

```bash
# Clone repository
git clone <repo-url>
cd JoinUp-Event-Management

# Backend setup
cd backend
cp .env.example .env  # Create from example
# Edit .env with your values
npm install
npm run seed
npm run start:dev

# Frontend setup (new terminal)
cd frontend
npm install
npm start
```

### .env.example

```bash
# Create .env.example (commit to repo)
JWT_SECRET=change_me_in_production
NODE_ENV=development
PORT=3000
DATABASE_URL=sqlite:data.sqlite
LOG_LEVEL=debug
```

---

## Troubleshooting

### Variables Not Loading

**Check**:
1. `.env` file exists in correct location
2. No quotes around values
3. No spaces around `=`
4. Server restarted after .env change

**Example**:
```env
# ✅ Correct
JWT_SECRET=your-secret-key
PORT=3000

# ❌ Wrong
JWT_SECRET = "your-secret-key"
PORT = 3000
```

### Can't Connect to Database

**Check**:
1. DATABASE_URL correct
2. Database server running
3. Connection string format correct
4. User has permissions

---

### API URL Wrong

**Check**:
1. Frontend apiUrl points to backend
2. Backend and frontend on same network
3. CORS configured correctly
4. No typos in URL

---

## Security Checklist

- [ ] .env in .gitignore
- [ ] .env.example committed (no secrets)
- [ ] JWT_SECRET changed from default
- [ ] Different secrets per environment
- [ ] Secrets in CI/CD stored securely
- [ ] Production database URL not in code
- [ ] API URL correct for environment
- [ ] CORS properly configured
- [ ] PUPPETEER_EXECUTABLE_PATH set if needed

---

## Related Documentation

- [Installation & Setup](./01-Installation-Setup.md)
- [Deployment Guide](./19-Deployment.md)
- [Architecture Overview](./09-Architecture.md)

---

**Security Note**: If you suspect compromised secrets, regenerate them immediately and update all copies.
