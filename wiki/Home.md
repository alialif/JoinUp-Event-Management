# JoinUp Event Management Wiki

Welcome to the JoinUp Event Management System Wiki! This is your comprehensive guide to understanding, using, and developing the JoinUp application.

## 📚 Documentation Pages

### Getting Started
- [Installation & Setup](./01-Installation-Setup.md) - How to get the project running locally
- [Quick Start Guide](./02-Quick-Start.md) - Get up and running in minutes
- [User Roles & Permissions](./03-User-Roles.md) - Understand the different user types

### Features & Usage
- [Event Management](./04-Event-Management.md) - Create, edit, and manage events
- [Member Registration](./05-Member-Registration.md) - User registration and profile management
- [Attendance Tracking](./06-Attendance-Tracking.md) - Mark and manage attendance
- [Certificates](./07-Certificates.md) - Generate and verify certificates
- [Bilingual Support](./08-Bilingual-Support.md) - English/French-Canadian interface

### Development & Architecture
- [Project Architecture](./09-Architecture.md) - System design and structure
- [API Documentation](./10-API-Reference.md) - REST API endpoints and usage
- [Database Schema](./11-Database-Schema.md) - Entity relationships and structure
- [Architecture Decision Records](./12-ADRs.md) - Design decisions and rationale

### Testing & Quality
- [Testing Guide](./13-Testing-Guide.md) - Unit, integration, and E2E testing
- [Test Scenarios](./14-Test-Scenarios.md) - Key testing workflows
- [Troubleshooting](./15-Troubleshooting.md) - Common issues and solutions

### Development
- [Code Style Guide](./16-Code-Style.md) - Coding standards and conventions
- [Contributing Guide](./17-Contributing.md) - How to contribute to the project
- [Environment Setup](./18-Environment-Variables.md) - Configuration and environment setup
- [Deployment Guide](./19-Deployment.md) - Production deployment instructions

---

## 🚀 Quick Links

**Running the Application:**
```bash
# Backend
cd backend && npm install && npm run seed && npm run start:dev

# Frontend  
cd frontend && npm install && npm start
```

**Access Points:**
- Frontend: http://localhost:4200
- Backend API: http://localhost:3000
- Swagger Docs: http://localhost:3000/api/docs

**Test Credentials:**
| Role | Email | Password |
|------|-------|----------|
| Admin | admin@bootcamp.com | admin123 |
| Staff | staff@bootcamp.com | staff123 |
| Participant | participant1@bootcamp.com | participant123 |

---

## 📋 Project Overview

JoinUp is a **100% AI-Generated Event Management System** created as part of the AI Bootcamp Sherbrooke 2025. It serves as a comprehensive testing ground for automated software testing practices.

**Key Features:**
- ✅ Full event lifecycle management
- ✅ Member registration with detailed profiles
- ✅ Attendance tracking
- ✅ PDF certificate generation with QR codes
- ✅ Role-based access control
- ✅ Bilingual interface (EN/FR)
- ✅ Comprehensive audit logging
- ✅ REST API with Swagger documentation

**Tech Stack:**
- **Frontend**: Angular 20+, RxJS, ngx-translate
- **Backend**: NestJS 10+, TypeORM, SQLite
- **Testing**: Jest, Cypress, Playwright
- **Additional**: Puppeteer (PDF generation), JWT authentication

---

## 🤝 Need Help?

- Check the [Troubleshooting](./15-Troubleshooting.md) page for common issues
- Review the [API Documentation](./10-API-Reference.md) for integration questions
- See [Testing Guide](./13-Testing-Guide.md) for test-related queries

---

**Last Updated:** December 2025  
**Project**: AI Bootcamp Sherbrooke 2025  
**Purpose**: Test Automation Practice & AI-Generated Code Demonstration
