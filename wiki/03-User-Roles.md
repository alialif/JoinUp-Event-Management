# User Roles & Permissions

JoinUp implements a role-based access control (RBAC) system with three primary roles.

---

## Role Overview

### 👤 Participant

**Default role for newly registered users.**

**Permissions:**
- ✅ Register for events (if event hasn't started)
- ✅ View registered events
- ✅ View event details
- ✅ Download certificates for completed events
- ✅ Verify certificates via QR code
- ✅ Update personal profile
- ✅ View personal information

**Restrictions:**
- ❌ Cannot create events
- ❌ Cannot mark attendance
- ❌ Cannot issue certificates
- ❌ Cannot manage users
- ❌ Cannot view audit logs

**Access Points:**
- Events list and details
- My Events
- Certificates
- Profile

---

### 👨‍💼 Staff

**Elevated role for event organizers and moderators.**

**Permissions:**
- ✅ All Participant permissions
- ✅ Create events
- ✅ Edit events they created
- ✅ Mark attendance for events
- ✅ Issue certificates (PDF + QR codes)
- ✅ View event registrations
- ✅ Access attendance tracking
- ✅ View audit logs

**Restrictions:**
- ❌ Cannot promote/demote users
- ❌ Cannot delete events created by others
- ❌ Cannot change other users' roles
- ❌ Cannot access user management

**Access Points:**
- Create Event page
- Event management
- Attendance marking
- Certificate issuance
- Audit logs

---

### 🔐 Admin

**Full system access and control.**

**Permissions:**
- ✅ All Staff permissions
- ✅ Change any user's role
- ✅ Delete any event
- ✅ Delete users
- ✅ View comprehensive audit logs
- ✅ Access user management panel
- ✅ Manage system settings
- ✅ View all system activity

**Restrictions:**
- None - full administrative access

**Access Points:**
- All application features
- Sidebar navigation (Events, Users)
- User management panel
- Complete audit log history

---

## Role Hierarchy

```
Admin
  ↓
Staff
  ↓
Participant
```

- **Admins** can perform all Staff and Participant actions
- **Staff** can perform all Participant actions
- **Participants** have the most restricted access

---

## Changing User Roles

### As an Admin

1. Login with admin credentials
2. Click **"Users"** in the sidebar
3. View the list of all registered users
4. Find the user you want to modify
5. Click the **role dropdown** next to their name
6. Select new role:
   - Participant
   - Staff
   - Admin
7. Change applies immediately
8. Action is logged in audit trail

### Programmatically (API)

```bash
PUT /auth/members/:memberId/role
Body: { "role": "staff" }
```

---

## Feature Access Matrix

| Feature | Participant | Staff | Admin |
|---------|:-----------:|:-----:|:-----:|
| Login | ✅ | ✅ | ✅ |
| Register for Events | ✅ | ✅ | ✅ |
| View Events | ✅ | ✅ | ✅ |
| Create Events | ❌ | ✅ | ✅ |
| Edit Events | ❌ | ✅* | ✅ |
| Delete Events | ❌ | ❌ | ✅ |
| Mark Attendance | ❌ | ✅ | ✅ |
| Issue Certificates | ❌ | ✅ | ✅ |
| Verify Certificates | ✅ | ✅ | ✅ |
| View Registrations | ❌ | ✅ | ✅ |
| Manage Users | ❌ | ❌ | ✅ |
| Change Roles | ❌ | ❌ | ✅ |
| View Audit Logs | ❌ | ✅ | ✅ |
| Delete Users | ❌ | ❌ | ✅ |

*Staff can only edit events they created

---

## Default Test Users

After seeding the database:

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@bootcamp.com | admin123 |
| Staff | staff@bootcamp.com | staff123 |
| Participant | participant1@bootcamp.com | participant123 |

---

## Security Considerations

### Password Requirements
- Minimum 6 characters
- Hashed with bcrypt (10 rounds)
- Never stored in plain text

### JWT Tokens
- Expire after 24 hours
- Stored securely in localStorage
- Automatically refreshed on page reload

### Audit Trail
- All role changes are logged
- All admin actions recorded
- Permanent audit history (indefinite retention)

---

## Session Management

### Auto-Logout
- Sessions last 24 hours
- Inactive sessions are maintained (no idle timeout)
- Users can manually logout

### Multi-Device Access
- One account can be logged in from multiple devices
- Previous sessions remain valid unless explicitly logged out

---

## Best Practices

### Admin Responsibilities
- Regularly review audit logs
- Monitor user role assignments
- Only grant admin access when necessary
- Keep test accounts separated from production users

### Security Guidelines
- Change default test passwords in production
- Use strong, unique passwords
- Regularly review user access levels
- Implement IP whitelisting if needed (custom)

---

## Related Documentation

- [API Reference - Auth Endpoints](./10-API-Reference.md#authentication)
- [Architecture - Security Layer](./09-Architecture.md#security)
- [Audit Logging](./12-ADRs.md#audit-logging)

---

**Need help?** See [Troubleshooting - Authentication](./15-Troubleshooting.md#authentication-issues)
