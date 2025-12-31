# Troubleshooting Guide

Solutions to common issues and problems in JoinUp.

---

## Server Issues

### Backend Server Won't Start

**Error**: `Error: connect EADDRINUSE :::3000`

**Cause**: Port 3000 already in use

**Solutions**:
```bash
# Kill process on port 3000
lsof -ti:3000 | xargs kill -9

# Or use different port
PORT=3001 npm run start:dev

# Or find what's using the port
netstat -an | grep 3000
```

---

### Frontend Development Server Won't Start

**Error**: `Module not found` or platform-specific errors

**Cause**: Windows-specific dependencies or missing node_modules

**Solutions**:
```bash
# Clean install
rm -rf node_modules package-lock.json
npm install

# For macOS ARM64 (Apple Silicon):
# Remove Windows-specific packages from package.json
# Edit frontend/package.json and remove "@rollup/rollup-win32-x64-msvc"

# Clear npm cache
npm cache clean --force
npm install
```

**Error**: `Command not found: ng`

**Cause**: Angular CLI not installed globally

**Solutions**:
```bash
# Use npx instead
npx ng serve

# Or use npm scripts
npm start
```

---

### Cannot Connect to API

**Frontend Can't Reach Backend**

**Error**: `Error: connect ECONNREFUSED 127.0.0.1:3000`

**Cause**: Backend not running or API URL wrong

**Solutions**:
```bash
# Verify backend is running
npm run start:dev  # in backend directory

# Check API URL in frontend
# File: frontend/src/environments/environment.ts
// Should have: apiUrl: 'http://localhost:3000'

# Verify both servers on same machine/network
# Backend: http://localhost:3000
# Frontend: http://localhost:4200
```

---

## Database Issues

### Database File Corrupted

**Error**: `database disk image malformed` or similar

**Cause**: Database file corrupted or locked

**Solutions**:
```bash
# Delete and recreate
cd backend
rm -f data.sqlite
npm run seed

# Or if backed up
cp backup/data.sqlite.backup data.sqlite
npm run start:dev
```

---

### Can't Seed Database

**Error**: `Error: EACCES: permission denied`

**Cause**: Permission issues or database locked

**Solutions**:
```bash
# Ensure no server running
npm run start:dev  # Stop this first

# Clear database
rm -f data.sqlite

# Re-seed
npm run seed

# Or use chmod for permission issues
chmod 644 data.sqlite
```

---

### Connection Pool Issues

**Error**: `Error: Unable to acquire a new connection`

**Cause**: Too many concurrent connections

**Solutions**:
```bash
# Restart backend
npm run start:dev

# Check for stuck connections
# Stop and start fresh

# In TypeORM config, adjust pool size
// typeorm.config.ts
extra: {
  max: 20,
  min: 5
}
```

---

## Authentication Issues

### Can't Login

**Error**: Invalid credentials / Email not found

**Possible Causes**:
- Wrong email/password
- Account not created
- Database not seeded

**Solutions**:
```bash
# Verify default accounts exist
npm run seed

# Test with known credentials:
Email: admin@bootcamp.com
Password: admin123

# Check database
# Connect to SQLite: sqlite3 data.sqlite
# Query: SELECT * FROM member WHERE email='admin@bootcamp.com';

# Reset password (if custom user):
# Re-seed database: npm run seed
```

---

### JWT Token Expired

**Error**: `401 Unauthorized` or `Token expired`

**Cause**: JWT token expired (24h default)

**Solutions**:
```bash
# Logout and login again
# Token will be refreshed

# Check token in browser console:
console.log(localStorage.getItem('token'))

# Manual token refresh endpoint (if implemented):
POST /auth/refresh
```

---

### Token Not Sending

**Error**: API returns 401 even when logged in

**Cause**: Token not included in requests

**Solutions**:

Check browser DevTools → Network:
- See if `Authorization: Bearer <token>` header present
- Should appear on all authenticated requests

Check frontend auth interceptor:
```typescript
// frontend/src/app/core/auth.interceptor.ts
// Should add token to all requests
```

Clear localStorage and login again:
```javascript
localStorage.clear();
// Then login
```

---

## Validation & Input Errors

### Registration Failed

**Error**: `Validation failed` or `Email already exists`

**Solutions**:

**Duplicate Email**:
- Use unique email not registered
- Check exact spelling
- Try with different domain

**Invalid Email Format**:
- Format: `user@domain.com`
- No spaces
- Must have @ and domain

**Password Too Short**:
- Minimum 6 characters
- Try: `password123`

**Missing Fields**:
- All fields required
- Fill complete form
- Check for typos

---

### Form Won't Submit

**Error**: Form disabled or validation errors shown

**Solutions**:
```bash
# Check all fields filled
# Email format: user@example.com
# Password 6+ chars
# Passwords match
# Birth date valid (not in future)
# Gender selected

# Check browser console for errors
F12 → Console → Look for red errors

# Try clearing form and retrying
# Refresh page and try again
```

---

## API Errors

### 400 Bad Request

**Cause**: Invalid input data

**Check**:
- Email format valid
- Required fields present
- Data types correct
- Date format valid (ISO 8601)

**Example Fix**:
```javascript
// Wrong
{ startDate: "12/15/2025" }

// Correct
{ startDate: "2025-12-15T09:00:00Z" }
```

---

### 401 Unauthorized

**Cause**: Missing or invalid token

**Solutions**:
- Login again
- Check token in localStorage
- Verify Authorization header sent
- Check token not expired

---

### 403 Forbidden

**Cause**: Insufficient permissions

**Check**:
- User role correct for action
- Try with admin account
- Check role in database
- Verify role not changed

---

### 404 Not Found

**Cause**: Resource doesn't exist

**Solutions**:
- Verify ID exists
- Check correct endpoint
- Verify resource not deleted
- Try with different ID

---

### 409 Conflict

**Cause**: Resource already exists or state conflict

**Common Causes**:
- Duplicate registration for same event
- Duplicate email during registration
- Certificate already issued

**Solutions**:
- Verify resource exists
- Check for duplicates
- Use different email/data
- Try with different event

---

## PDF & Certificate Issues

### Certificate Won't Generate

**Error**: PDF generation failed

**Cause**: Puppeteer not configured or Chrome missing

**Solutions**:
```bash
# Ensure Puppeteer installed
npm list puppeteer

# On macOS, Chrome usually found automatically
# If not:
export PUPPETEER_EXECUTABLE_PATH=/Applications/Google\ Chrome.app/Contents/MacOS/Google\ Chrome
npm run start:dev

# On Linux:
apt-get install chromium
export PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium
```

---

### QR Code Not Working

**Error**: QR code scanning fails

**Cause**: QR code not generated or malformed

**Solutions**:
```bash
# Check certificate issuance succeeded
# Verify PDF opens
# Check QR code appears in PDF
# Try different QR scanner app
# Ensure clear photo of QR code

# Manual verification:
# Use certificate ID instead of QR
POST /certificates/verify?code=CERT-2025-00123
```

---

### PDF Download Fails

**Error**: Download stuck or empty file

**Cause**: PDF generation incomplete or corrupted

**Solutions**:
```bash
# Wait for generation to complete
# Check backend logs for errors
# Try issuing certificate again
# Try different browser
# Check browser download settings (may block PDFs)

# In Chrome Settings:
Settings → Privacy and Security → Files
→ Unblock PDFs if blocked
```

---

## Performance Issues

### Application Slow/Freezing

**Cause**: Large dataset, high load, or memory leak

**Solutions**:
```bash
# Check browser DevTools (F12)
# Performance tab → Record → Interact → Stop
# Look for long tasks (> 50ms)

# Clear browser cache
Ctrl+Shift+Delete (or Cmd+Shift+Delete on Mac)

# Restart servers
npm run start:dev  # backend
npm start          # frontend

# Check for memory leaks
# DevTools → Memory → Take heap snapshot
```

---

### Events List Loading Slowly

**Cause**: Many events or poor network

**Solutions**:
```bash
# Check pagination limit
# Should load 50 at a time max
# Not all events at once

# Clear database if test data huge
npm run seed  # Fresh seed

# Check network tab in DevTools
# See if requests slow
# Check response size
```

---

### Certificate Generation Slow

**Cause**: Many certificates generating at once

**Solutions**:
```bash
# Puppeteer CPU intensive
# Generate in batches if many
# Not all at once

# Check backend logs
# Look for Puppeteer process time
# May need optimization
```

---

## Deployment Issues

### Application Works Locally but Not in Production

**Common Causes**:
- Different database
- Different environment variables
- Incorrect API URLs
- Missing dependencies

**Solutions**:
```bash
# Verify environment variables
# Check .env file exists
# Verify JWT_SECRET set
# Check database connection string

# Verify API URL in frontend
# Should point to production server
# Not localhost:3000

# Check logs
# Production logs should show errors
# Review application logs
```

---

## Browser Issues

### Application Won't Load

**Error**: Blank page or 404

**Cause**: Frontend assets not built or served

**Solutions**:
```bash
# Verify frontend running
npm start  # in frontend directory

# Check correct URL
http://localhost:4200  # NOT 3000

# Clear browser cache
Ctrl+Shift+Delete

# Hard refresh
Ctrl+Shift+R (or Cmd+Shift+R on Mac)

# Try incognito window
Ctrl+Shift+N
```

---

### JavaScript Errors in Console

**Error**: White screen with console errors

**Check**:
1. DevTools Console tab
2. Read error messages carefully
3. Note line numbers
4. Search for that line in source code

**Common Errors**:
- `Cannot read property of undefined`
  → Check null/undefined before access
- `Module not found`
  → Check import paths
- `Service not injected`
  → Check service in providers

---

### CORS Errors

**Error**: `Access to XMLHttpRequest blocked by CORS policy`

**Cause**: Frontend and backend on different domains

**Solutions**:

Backend is already configured with CORS. If still errors:

```typescript
// backend/main.ts
app.enableCors({
  origin: 'http://localhost:4200',
  credentials: true,
});
```

Frontend check API URL:
```typescript
// frontend/src/environments/environment.ts
apiUrl: 'http://localhost:3000'  // Must match backend
```

---

## Testing Issues

### Tests Won't Run

**Error**: `Command not found: jest`

**Solutions**:
```bash
# Use npm script
npm test  # not npx jest

# Or install Jest globally
npm install -g jest
```

---

### Tests Failing

**Error**: Test cases fail

**Check**:
1. Mock data correct
2. Service dependencies mocked
3. Database seeded for integration tests
4. API running for E2E tests

---

### E2E Tests Failing

**Error**: Cypress tests fail

**Solutions**:
```bash
# Ensure frontend running
npm start  # in frontend directory

# Ensure backend running
npm run start:dev  # in backend directory

# Database seeded
npm run seed

# Try test in headed mode to see UI
npm run e2e -- --headed

# Check test selectors exist
# Data-testid attributes present in components
```

---

## Language & Internationalization Issues

### UI Not Translating

**Error**: Keys showing instead of translations

**Cause**: Missing translation key in JSON

**Solutions**:
```bash
# Check translation file exists
# frontend/src/assets/i18n/en.json
# frontend/src/assets/i18n/fr-CA.json

# Key must exist in both files
// en.json
{ "auth": { "login": "Login" } }

// fr-CA.json
{ "auth": { "login": "Connexion" } }

# Clear browser cache
# Restart dev server
npm start
```

---

## Getting Help

### Check Logs

**Backend Logs**:
```
Terminal where npm run start:dev running
Look for ERROR in output
```

**Frontend Logs**:
```
Browser DevTools (F12)
Console tab
Check for red errors
```

**Database Logs**:
```bash
sqlite3 data.sqlite ".log on"
```

---

### Common Log Messages

| Message | Meaning | Fix |
|---------|---------|-----|
| `EADDRINUSE` | Port in use | Kill process or use different port |
| `ECONNREFUSED` | Server not running | Start backend |
| `404 Not Found` | Resource doesn't exist | Check ID/endpoint |
| `401 Unauthorized` | Invalid token | Login again |
| `VALIDATION FAILED` | Input data invalid | Fix data format |

---

### Debug Mode

**Enable Debug Logging**:

```bash
# Backend
DEBUG=* npm run start:dev

# Frontend
ng serve --verbose
```

---

## Still Not Working?

### Escalation Steps

1. **Check this guide** - You're reading it!
2. **Check logs** - Look at error messages
3. **Check code comments** - May have hints
4. **Check existing issues** - Might be known
5. **Check API docs** - May have details
6. **Reset and try again** - Delete node_modules, reinstall

### Information to Gather Before Asking for Help

- Error message (exact text)
- Terminal output where error occurred
- Browser console errors
- What you were trying to do
- What you expected to happen
- What happened instead
- Steps to reproduce

---

## Related Documentation

- [Installation & Setup](./01-Installation-Setup.md)
- [Quick Start Guide](./02-Quick-Start.md)
- [Architecture Overview](./09-Architecture.md)
- [API Reference](./10-API-Reference.md)
- [Testing Guide](./13-Testing-Guide.md)

---

**Can't find your issue?** Check the [main documentation](./Home.md) or contact the development team.
