# Deployment Guide

Complete guide to deploying JoinUp to production environments.

---

## Deployment Overview

JoinUp can be deployed to various platforms. This guide covers common deployment scenarios.

---

## Pre-Deployment Checklist

- [ ] All tests passing (`npm test`)
- [ ] Code reviewed and approved
- [ ] Database backups created
- [ ] Environment variables configured
- [ ] Security scan completed
- [ ] Performance tested
- [ ] Documentation updated
- [ ] Deployment plan documented

---

## Backend Deployment

### Build Backend

```bash
cd backend

# Install dependencies
npm install

# Build for production
npm run build

# Output: dist/ directory with compiled code
```

### Backend Requirements

- Node.js 20+
- npm 10+
- Chrome/Chromium (for PDF generation with Puppeteer)
- Database (PostgreSQL recommended for production)

### Database Setup

#### PostgreSQL Migration (Recommended)

For production, upgrade from SQLite to PostgreSQL:

```bash
# 1. Create database
createdb joinup_prod

# 2. Update connection string
DATABASE_URL=postgresql://user:password@localhost:5432/joinup_prod

# 3. Run migrations
npm run typeorm migration:run

# 4. Seed if needed
npm run seed
```

#### SQLite to PostgreSQL

```bash
# 1. Export from SQLite
npm run export:sqlite  # Custom script needed

# 2. Import to PostgreSQL
psql -U postgres joinup_prod < dump.sql
```

### Environment Setup

Create `.env` for production:

```env
NODE_ENV=production
PORT=3000
JWT_SECRET=use-strong-random-key-here
DATABASE_URL=postgresql://user:securepass@db-host:5432/joinup
LOG_LEVEL=warn
PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium
```

### Running Backend

```bash
# Direct
node dist/main.js

# With environment variables
NODE_ENV=production JWT_SECRET=... node dist/main.js

# With PM2 (recommended for production)
npm install -g pm2
pm2 start dist/main.js --name "joinup-api"
pm2 save
pm2 startup
```

### PM2 Configuration

Create `ecosystem.config.js`:

```javascript
module.exports = {
  apps: [{
    name: 'joinup-api',
    script: './dist/main.js',
    instances: 'max',
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'production',
      PORT: 3000,
    },
    error_file: './logs/error.log',
    out_file: './logs/out.log',
    log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
  }],
};
```

---

## Frontend Deployment

### Build Frontend

```bash
cd frontend

# Install dependencies
npm install

# Build for production
npm run build

# Output: dist/frontend/ directory
```

### Deploy to Static Hosting

#### Option 1: Vercel (Recommended for Angular)

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel --prod

# Configure environment in Vercel dashboard
NEXT_PUBLIC_API_URL=https://api.joinup.com
```

#### Option 2: Netlify

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Deploy
netlify deploy --prod

# Configure in netlify.toml
[build]
  command = "ng build"
  publish = "dist/frontend/browser"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

#### Option 3: GitHub Pages

```bash
# Update angular.json
"baseHref": "/JoinUp-Event-Management/"

# Build
npm run build -- --base-href=/JoinUp-Event-Management/

# Deploy to gh-pages branch
npm run deploy
```

#### Option 4: Self-Hosted (Nginx)

```bash
# Build
npm run build

# Copy to web server
sudo cp -r dist/frontend/browser /var/www/joinup

# Create Nginx config
sudo nano /etc/nginx/sites-available/joinup
```

**Nginx Configuration**:
```nginx
server {
    listen 80;
    server_name joinup.example.com;

    # Redirect to HTTPS
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name joinup.example.com;

    ssl_certificate /etc/ssl/certs/joinup.crt;
    ssl_certificate_key /etc/ssl/private/joinup.key;

    root /var/www/joinup;
    index index.html;

    # Angular routing
    location / {
        try_files $uri $uri/ /index.html;
    }

    # API proxy
    location /api/ {
        proxy_pass http://localhost:3000/api/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    # Caching
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

**Enable**:
```bash
sudo ln -s /etc/nginx/sites-available/joinup /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

---

## Docker Deployment

### Backend Dockerfile

Create `backend/Dockerfile`:

```dockerfile
FROM node:20-alpine

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm ci --only=production

# Install Chromium for Puppeteer
RUN apk add --no-cache chromium

# Build application
COPY . .
RUN npm run build

# Expose port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3000/health', (r) => {if (r.statusCode !== 200) throw new Error(r.statusCode)})"

# Start application
CMD ["node", "dist/main.js"]
```

### Frontend Dockerfile

Create `frontend/Dockerfile`:

```dockerfile
# Build stage
FROM node:20-alpine as builder

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

# Production stage
FROM nginx:alpine

COPY nginx.conf /etc/nginx/nginx.conf
COPY --from=builder /app/dist/frontend/browser /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
```

### Docker Compose

Create `docker-compose.prod.yml`:

```yaml
version: '3.8'

services:
  # PostgreSQL Database
  db:
    image: postgres:15-alpine
    environment:
      POSTGRES_USER: joinup
      POSTGRES_PASSWORD: ${DB_PASSWORD}
      POSTGRES_DB: joinup_prod
    volumes:
      - postgres_data:/var/lib/postgresql/data
    restart: unless-stopped

  # Backend API
  backend:
    build:
      context: ./backend
      dockerfile: Dockerfile
    ports:
      - "3000:3000"
    environment:
      NODE_ENV: production
      JWT_SECRET: ${JWT_SECRET}
      DATABASE_URL: postgresql://joinup:${DB_PASSWORD}@db:5432/joinup_prod
      PUPPETEER_EXECUTABLE_PATH: /usr/bin/chromium
    depends_on:
      - db
    restart: unless-stopped

  # Frontend
  frontend:
    build:
      context: ./frontend
      dockerfile: Dockerfile
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./certs:/etc/nginx/certs
      - ./nginx.conf:/etc/nginx/nginx.conf:ro
    depends_on:
      - backend
    restart: unless-stopped

volumes:
  postgres_data:
```

### Build and Run

```bash
# Build images
docker-compose -f docker-compose.prod.yml build

# Start services
docker-compose -f docker-compose.prod.yml up -d

# View logs
docker-compose logs -f backend

# Stop services
docker-compose -f docker-compose.prod.yml down
```

---

## Kubernetes Deployment

### Backend Deployment

Create `k8s/backend-deployment.yaml`:

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: joinup-api
spec:
  replicas: 3
  selector:
    matchLabels:
      app: joinup-api
  template:
    metadata:
      labels:
        app: joinup-api
    spec:
      containers:
      - name: api
        image: joinup-api:latest
        ports:
        - containerPort: 3000
        env:
        - name: NODE_ENV
          value: "production"
        - name: JWT_SECRET
          valueFrom:
            secretKeyRef:
              name: joinup-secrets
              key: jwt-secret
        - name: DATABASE_URL
          valueFrom:
            secretKeyRef:
              name: joinup-secrets
              key: database-url
        livenessProbe:
          httpGet:
            path: /health
            port: 3000
          initialDelaySeconds: 30
          periodSeconds: 10
        readinessProbe:
          httpGet:
            path: /health
            port: 3000
          initialDelaySeconds: 5
          periodSeconds: 5
```

### Frontend Service

Create `k8s/frontend-service.yaml`:

```yaml
apiVersion: v1
kind: Service
metadata:
  name: joinup-frontend
spec:
  type: LoadBalancer
  ports:
  - protocol: TCP
    port: 80
    targetPort: 80
  selector:
    app: joinup-frontend
```

### Deploy

```bash
kubectl apply -f k8s/
```

---

## SSL/TLS Configuration

### Let's Encrypt (Free)

```bash
# Install Certbot
sudo apt-get install certbot python3-certbot-nginx

# Get certificate
sudo certbot certonly --nginx -d joinup.example.com

# Auto-renewal
sudo systemctl enable certbot.timer
sudo systemctl start certbot.timer
```

### Self-Signed Certificate (Testing Only)

```bash
openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
  -keyout /etc/ssl/private/joinup.key \
  -out /etc/ssl/certs/joinup.crt
```

---

## Database Backup & Recovery

### PostgreSQL Backup

```bash
# Full backup
pg_dump -U joinup joinup_prod > backup.sql

# Compressed backup
pg_dump -U joinup joinup_prod | gzip > backup.sql.gz

# Automated daily backup
0 2 * * * pg_dump -U joinup joinup_prod | gzip > /backups/$(date +\%Y\%m\%d).sql.gz
```

### Recovery

```bash
# Restore from backup
psql -U joinup joinup_prod < backup.sql

# Or from compressed
gunzip < backup.sql.gz | psql -U joinup joinup_prod
```

---

## Performance Optimization

### Backend Optimization

```typescript
// Enable caching
import { CacheModule } from '@nestjs/cache-manager';

@Module({
  imports: [CacheModule.register()],
})
export class AppModule {}
```

### Frontend Optimization

```bash
# Enable production mode
ng build --configuration production --optimization --aot

# Output analysis
npm install -g webpack-bundle-analyzer
```

### CDN Configuration

```nginx
# Cache static assets
location ~* \.(js|css|png|jpg|gif|ico)$ {
  expires 30d;
  add_header Cache-Control "public, immutable";
}

# Use CloudFront or similar
```

---

## Monitoring & Logging

### Application Monitoring

```bash
# PM2 monitoring
pm2 monit

# Or with New Relic
npm install newrelic
# Add to dist/main.js: require('newrelic');
```

### Logging

```bash
# View PM2 logs
pm2 logs joinup-api

# Or from Docker
docker logs -f joinup_backend_1

# Centralized logging (ELK stack)
# Elasticsearch → Logstash → Kibana
```

---

## Rollback Procedure

### Git-Based Rollback

```bash
# Find previous version
git tag

# Checkout previous version
git checkout v1.0.0

# Rebuild and restart
npm run build
pm2 restart all
```

### Database Rollback

```bash
# Restore from backup
pg_dump backup.sql | psql joinup_prod

# Or use TypeORM migrations
npm run typeorm migration:revert
```

---

## Health Checks

### Backend Health Endpoint

```typescript
@Get('/health')
health(): { status: string } {
  return { status: 'ok' };
}
```

### Verify Deployment

```bash
# API health
curl https://api.joinup.com/health

# Frontend loads
curl -L https://joinup.com | grep -q "JoinUp" && echo "OK"

# Database connection
psql -c "SELECT 1"
```

---

## Troubleshooting Deployment

### Application Won't Start

Check logs:
```bash
pm2 logs
docker logs
journalctl -u service-name
```

### Database Connection Issues

```bash
# Test connection
psql -h db-host -U user -d database

# Check environment variables
env | grep DATABASE
```

### High Memory Usage

```bash
# Check Node.js heap
node --max-old-space-size=4096 dist/main.js

# Profile with clinic.js
npm install -g clinic
clinic doctor -- node dist/main.js
```

---

## Post-Deployment

### Verify Deployment

1. Test API endpoints: `curl https://api.joinup.com/events`
2. Test frontend: `https://joinup.com/login`
3. Check database: `psql -c "SELECT COUNT(*) FROM member;"`
4. Monitor logs: `pm2 logs`

### Backup Current Version

```bash
git tag v1.0.0-prod
git push --tags
```

### Communication

- Notify stakeholders of deployment
- Document any issues encountered
- Update deployment log/wiki

---

## Scaling Considerations

### Horizontal Scaling (Multiple Servers)

- Load balancer (Nginx, HAProxy)
- Stateless API servers
- Shared database (PostgreSQL)
- Session store (Redis)

### Vertical Scaling (Bigger Server)

- Increase CPU/RAM
- Optimize queries
- Add caching layer

---

## Related Documentation

- [Installation & Setup](./01-Installation-Setup.md)
- [Environment Variables](./18-Environment-Variables.md)
- [Architecture Overview](./09-Architecture.md)
- [API Reference](./10-API-Reference.md)

---

**Safety First**: Always test deployment in staging before production!
