# Member Registration Guide

Complete guide to user registration, profile management, and account settings in JoinUp.

---

## Registration Overview

JoinUp uses a comprehensive registration process that collects essential member information for event management, certificate generation, and communication.

---

## New User Registration

### Accessing Registration

1. **Navigate to Login Page**: http://localhost:4200/login
2. **Click "Register here"** link below the login form
3. You'll be taken to the registration form

### Registration Form Fields

**Required Fields:**

| Field | Type | Requirements | Example |
|-------|------|--------------|---------|
| **Full Name** | Text | 2-100 characters | John Smith |
| **Email** | Email | Valid email, unique in system | john@example.com |
| **Password** | Password | Minimum 6 characters | securePass123 |
| **Confirm Password** | Password | Must match password field | securePass123 |
| **Birth Date** | Date | Must be valid date | 1990-05-15 |
| **Gender** | Select | One of four options | Male/Female/Other/Prefer not to say |

### Step-by-Step Registration

1. **Enter Full Name**
   - Used for certificates
   - Displayed in member lists
   - Used in audit logs

2. **Enter Email Address**
   - Must be unique (no duplicate accounts)
   - Used for login
   - Displayed in admin member list
   - Case-insensitive

3. **Create Password**
   - Minimum 6 characters
   - Mix of uppercase, lowercase, numbers recommended
   - Will be hashed with bcrypt before storage
   - Never shared with admins

4. **Confirm Password**
   - Must match the password field exactly
   - Case-sensitive
   - Shows error if mismatch

5. **Select Birth Date**
   - Click date picker
   - Select month, day, year
   - Used for demographic information
   - Optional for some systems, required here

6. **Select Gender**
   - Male
   - Female
   - Other
   - Prefer not to say
   - Ensures inclusive data collection

7. **Submit Form**
   - Click "Register" button
   - Form validates all fields
   - Success message appears
   - Redirected to login page

### Validation Rules

**Email Validation:**
- ✅ Valid format: user@domain.com
- ❌ Reject duplicates
- ❌ Reject invalid formats

**Password Validation:**
- ✅ Minimum 6 characters
- ✅ Can contain any characters
- ❌ Cannot be empty
- ❌ Must match confirmation

**Name Validation:**
- ✅ 2-100 characters
- ✅ Can contain spaces, hyphens, apostrophes
- ❌ Cannot be empty

**Birth Date Validation:**
- ✅ Valid calendar date
- ❌ Cannot be in the future
- ❌ Recommended: 13+ years old

---

## User Account Management

### Accessing Your Profile

1. Login to the application
2. Click username/profile icon in top-right header
3. Select "Profile" or "Account Settings"
4. View and edit your information

### Profile Information

**Viewable Information:**
- Full name
- Email address
- Birth date
- Gender
- Member since (account creation date)
- Current role (Participant/Staff/Admin)
- Registered events list

### Editing Profile

**What Can Be Changed:**
- ✅ Full name
- ✅ Birth date
- ✅ Gender
- ❌ Email (admin only)
- ❌ Role (admin only)

**How to Edit:**

1. Go to your profile
2. Click "Edit Profile" button
3. Modify desired fields
4. Click "Save"
5. Confirmation message appears

### Changing Password

**From Profile Page:**

1. Click "Change Password" link
2. Enter current password
3. Enter new password (6+ characters)
4. Confirm new password
5. Click "Update Password"
6. Must re-login with new password

**Password Change Rules:**
- Must know current password
- New password must differ from old
- Minimum 6 characters
- Changes take effect immediately

---

## Registration for Events

Once registered with JoinUp, members can register for events.

### How to Register for Events

See [Event Management Guide - Event Registrations](./04-Event-Management.md#event-registrations) for detailed instructions.

**Quick Overview:**
1. Login as participant
2. Go to Events page
3. Find event of interest
4. Click "View" button
5. Click "Register" button
6. Confirmation appears
7. Event appears in "My Events"

### Registration Restrictions

**Cannot Register If:**
- Event has already started
- Event is full (at capacity)
- Already registered for event
- Event has been cancelled

**Can Register If:**
- Event is upcoming
- Have available spots
- Not yet registered
- Not a conflict with another event

### Viewing Registered Events

**Your Events Dashboard:**
1. After login, view "My Events" section
2. Shows all events you're registered for
3. Status indicators:
   - 🔵 Upcoming (can still attend)
   - 🟢 In Progress (happening now)
   - 🔴 Completed (finished)
4. For completed events, see certificate options

---

## User Types & Default Accounts

### Participant (Default for New Users)

**Capabilities:**
- Register for events
- View event details
- Download certificates
- Update own profile
- Verify certificates

**Limitations:**
- Cannot create events
- Cannot manage other users
- Cannot access admin features

### Staff

**Additional Capabilities:**
- Create and edit events
- Mark attendance
- Issue certificates
- View audit logs

**Promoted by:**
- Admin account
- Via Users management panel

### Admin

**Full Capabilities:**
- All Staff capabilities
- Manage user roles
- Delete events
- Delete users
- Complete audit log access

**Creation:**
- First admin created during seeding
- Additional admins via role change by existing admin

---

## Account Deletion

### Self-Service Deletion

**Not available** - Contact administrator

### Admin Deletion

Admin can delete any user account:
1. Go to Users page
2. Find user to delete
3. Click "Delete" button
4. Confirm deletion
5. Account and all data deleted

**Effects of Deletion:**
- ❌ User cannot login
- ❌ Events they created remain (reassigned to admin)
- ⚠️ Registrations are cancelled
- ⚠️ Certificates still valid if downloaded
- ✅ Audit log preserved

---

## Default Test Accounts

After database seeding:

| Email | Password | Role | Purpose |
|-------|----------|------|---------|
| admin@bootcamp.com | admin123 | Admin | Administrative access |
| staff@bootcamp.com | staff123 | Staff | Event creation/management |
| participant1@bootcamp.com | participant123 | Participant | Standard user |

**Before Production:**
- Change all default passwords
- Create your own admin account
- Delete test accounts

---

## Security Best Practices

### Password Security
- ✅ Use strong, unique passwords
- ✅ Don't share your password
- ✅ Don't reuse passwords from other sites
- ❌ Don't write passwords down
- ❌ Don't store in browser password managers (production)

### Account Safety
- ✅ Logout when finished
- ✅ Use secure, private network for login
- ✅ Update password regularly
- ❌ Don't leave session unattended
- ❌ Don't login from public WiFi (production)

### Email Address
- ✅ Use valid, monitored email
- ✅ Keep email secure
- ❌ Don't share email with others
- ❌ Don't use public/temporary emails (production)

---

## Troubleshooting Registration

### "Email already exists"
- Email is already registered
- Use different email or
- Login with existing account if it's yours

### "Passwords don't match"
- Confirmation password doesn't match password field
- Re-enter both and verify match

### "Invalid email format"
- Email doesn't follow valid format
- Example: user@domain.com
- Check for spaces, missing @, missing domain

### "Password too short"
- Password must be 6+ characters
- Increase length and try again

### Can't login after registration
- Verify email and password are correct
- Check password hasn't expired
- Try resetting password

---

## API Reference

See [API Documentation](./10-API-Reference.md#authentication) for:
- `POST /auth/register` - Register new member
- `POST /auth/login` - Login and get JWT token
- `GET /auth/members` - List all members (admin only)
- `PUT /auth/members/:id` - Update member
- `PUT /auth/members/:id/role` - Change user role (admin only)

---

## Related Documentation

- [User Roles & Permissions](./03-User-Roles.md)
- [Event Management](./04-Event-Management.md)
- [Certificates](./07-Certificates.md)
- [API Reference](./10-API-Reference.md#authentication)

---

**Need help?** Check [Troubleshooting - Registration](./15-Troubleshooting.md#registration-issues)
