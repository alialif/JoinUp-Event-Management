# Test Scenarios

Key test scenarios and workflows for manual and automated testing.

---

## Test Scenarios Overview

This document provides critical user workflows and test scenarios that should be verified during testing.

---

## Participant Flow Scenarios

### Scenario 1: New User Registration

**Objective**: Verify new user can register successfully

**Steps**:
1. Navigate to login page
2. Click "Register here"
3. Fill form:
   - Name: John Smith
   - Email: john@example.com
   - Password: SecurePass123
   - Confirm Password: SecurePass123
   - Birth Date: 1990-05-15
   - Gender: Male
4. Click Register
5. Verify success message
6. Navigate to login
7. Login with new credentials

**Expected Result**:
- ✅ User account created
- ✅ Success message displayed
- ✅ Can login with new credentials
- ✅ User role is "Participant"

**Test Data**:
```json
{
  "name": "John Smith",
  "email": "john-" + Date.now() + "@example.com",
  "password": "SecurePass123",
  "birthDate": "1990-05-15",
  "gender": "male"
}
```

---

### Scenario 2: Event Registration

**Objective**: Verify participant can register for events

**Preconditions**:
- User logged in as Participant
- At least one upcoming event exists

**Steps**:
1. Login as participant
2. Navigate to Events
3. Find upcoming event
4. Click "View"
5. Click "Register"
6. Confirm registration
7. Verify success message
8. Check event appears in "My Events"

**Expected Result**:
- ✅ Registration successful
- ✅ Success message displayed
- ✅ Button changes to "You are already registered"
- ✅ Event appears in My Events list

**Error Cases to Test**:
- ❌ Cannot register for started event → Error displayed
- ❌ Cannot register if at capacity → Error displayed
- ❌ Cannot register twice → Error displayed

---

### Scenario 3: Download Certificate

**Objective**: Verify participant can download certificate

**Preconditions**:
- User logged in as Participant
- Event completed and attended
- Certificate issued

**Steps**:
1. Login as participant
2. Navigate to Events
3. Find completed event registered for
4. Look for "Certificate" button
5. Click "Certificate"
6. PDF downloads
7. Open PDF file
8. Verify certificate contents

**Expected Result**:
- ✅ PDF downloads
- ✅ File named appropriately
- ✅ Certificate shows:
  - Participant name
  - Event title
  - Event date
  - Certificate ID
  - QR code

**Test Verification**:
- PDF file exists
- PDF is valid/viewable
- Content matches event data

---

### Scenario 4: Verify Certificate

**Objective**: Verify certificate can be validated

**Preconditions**:
- Certificate exists and issued
- Downloaded certificate PDF

**Steps**:
1. Open certificate PDF
2. Find QR code
3. Scan QR code with smartphone
4. Verify page opens
5. Check certificate details displayed

**Alternative - Manual Verification**:
1. Go to verification page
2. Enter Certificate ID
3. Click Verify
4. Check details match

**Expected Result**:
- ✅ Verification successful
- ✅ Shows certificate as valid
- ✅ Displays participant name
- ✅ Displays event title
- ✅ Displays issue date

---

## Staff Flow Scenarios

### Scenario 5: Create Event

**Objective**: Verify staff can create events

**Preconditions**:
- User logged in as Staff

**Steps**:
1. Login as staff
2. Navigate to Events
3. Click "Create Event"
4. Fill form:
   - Title: "Angular Advanced Workshop"
   - Description: "Learn advanced Angular concepts..."
   - Location: "Room 101"
   - Start Date: 2025-12-20 at 09:00
   - End Date: 2025-12-20 at 17:00
   - Capacity: 50
   - Categories: Conference, Workshop
   - Price: Free
5. Click "Create"
6. Verify success message
7. Check event appears in list

**Expected Result**:
- ✅ Event created successfully
- ✅ Event appears in list
- ✅ Event shows correct details
- ✅ Can edit event

**Required Fields**:
- Title (required)
- Description (required)
- Start Date (required)
- End Date (required)
- Capacity (required)
- At least one category

---

### Scenario 6: Mark Attendance

**Objective**: Verify staff can mark attendance

**Preconditions**:
- Logged in as Staff
- Event has registered participants
- Event is in progress or completed

**Steps**:
1. Navigate to event detail
2. Go to Attendance tab
3. See list of registered participants
4. Check checkbox for attendees
5. Verify changes save
6. Refresh page
7. Verify attendance persisted

**Expected Result**:
- ✅ Can toggle attendance for each participant
- ✅ Changes save immediately
- ✅ Attendance persists after refresh
- ✅ Shows attendance count

**Test Cases**:
- Mark all as present
- Mark subset as present
- Unmark attendees
- Verify attendance rate calculated

---

### Scenario 7: Issue Certificates

**Objective**: Verify staff can issue certificates

**Preconditions**:
- Logged in as Staff
- Event completed
- Participants marked as attended

**Steps**:
1. Navigate to event detail
2. Go to Certificates tab
3. See list of attendees
4. Click "Issue" for participant
5. Verify certificate generated
6. See certificate details
7. Try "Issue All" to bulk generate

**Expected Result**:
- ✅ Certificate generated
- ✅ Certificate has unique ID
- ✅ QR code created
- ✅ PDF available
- ✅ Certificate code displayed

**Error Cases**:
- ❌ Cannot issue to non-attendee → Error
- ❌ Cannot issue twice → Error
- ❌ Cannot issue before event ends → Error

---

## Admin Flow Scenarios

### Scenario 8: Manage User Roles

**Objective**: Verify admin can change user roles

**Preconditions**:
- Logged in as Admin
- Multiple users exist

**Steps**:
1. Navigate to Users page
2. See list of all users
3. Find user to promote
4. Click role dropdown
5. Select "Staff"
6. Verify change applied
7. Logout and login as promoted user
8. Verify new permissions available

**Expected Result**:
- ✅ Role changes immediately
- ✅ User sees new capabilities after login
- ✅ Change logged in audit trail
- ✅ Cannot demote self to lower role

**Role Changes to Test**:
- Participant → Staff (should gain create event)
- Staff → Admin (should gain user management)
- Admin → Participant (should lose admin features)

---

### Scenario 9: Delete Event

**Objective**: Verify admin can delete events

**Preconditions**:
- Logged in as Admin
- Events exist with registrations

**Steps**:
1. Navigate to Events
2. Find event to delete
3. Click event detail
4. Click "Delete" button
5. Confirm deletion
6. Verify event removed from list
7. Check registrations deleted

**Expected Result**:
- ✅ Event deleted
- ✅ Removed from events list
- ✅ Registrations cascade deleted
- ✅ Action logged in audit trail

---

### Scenario 10: View Audit Logs

**Objective**: Verify admin can access audit logs

**Preconditions**:
- Logged in as Admin

**Steps**:
1. Navigate to Audit section
2. See list of recent actions
3. Filter by:
   - Date range
   - Entity type
   - Action type
4. Search specific entries
5. Verify details match actions

**Expected Result**:
- ✅ Audit logs accessible
- ✅ All admin actions visible
- ✅ Filtering works
- ✅ Details complete and accurate

**Logged Events**:
- User login/logout
- Event creation/deletion
- Role changes
- Attendance marking
- Certificate issuance

---

## Error Handling Scenarios

### Scenario 11: Invalid Login

**Steps**:
1. Go to login page
2. Enter invalid email
3. Enter wrong password
4. Click Login

**Expected Result**:
- ❌ Error message: "Invalid credentials"
- ❌ Not logged in
- ❌ Redirected to login page

---

### Scenario 12: Validation Errors

**Objective**: Verify form validation

**Steps**:
1. Try registering with:
   - No name
   - Duplicate email
   - Short password (< 6 chars)
   - Invalid email format

**Expected Result**:
- ❌ Form not submitted
- ❌ Error messages shown for each field
- ❌ User can correct and retry

---

### Scenario 13: Authorization Errors

**Objective**: Verify access control

**Preconditions**:
- Two browser windows: one admin, one participant

**Steps**:
1. As Participant: Try accessing `/admin/users`
2. Try accessing create event as participant
3. As Admin: Verify all pages accessible

**Expected Result**:
- ❌ Participant: 403 Forbidden or redirect
- ❌ Participant: Create button hidden or disabled
- ✅ Admin: All pages accessible

---

## Performance Scenarios

### Scenario 14: Large Event List

**Objective**: Verify system handles many events

**Steps**:
1. Seed database with 1000 events
2. Load events page
3. Check load time < 2 seconds
4. Pagination works
5. Filtering responsive

**Expected Result**:
- ✅ Page loads in reasonable time
- ✅ Pagination shows 50 per page
- ✅ Can navigate pages
- ✅ Filtering responsive

---

### Scenario 15: Bulk Certificate Generation

**Objective**: Verify performance with many certificates

**Preconditions**:
- Event with 500 registered participants

**Steps**:
1. Mark all as attended
2. Click "Issue All Certificates"
3. Monitor progress
4. Check all certificates generated

**Expected Result**:
- ✅ Progress shown
- ✅ All certificates generated
- ✅ System responsive
- ✅ Completes in reasonable time (< 5 min)

---

## Internationalization Scenarios

### Scenario 16: Language Switching

**Objective**: Verify i18n works correctly

**Steps**:
1. Login to application
2. Set language to English
3. Check all UI in English
4. Switch to French (fr-CA)
5. Check all UI in French
6. Switch back to English
7. Logout and login
8. Verify language preference persisted

**Expected Result**:
- ✅ All UI translates immediately
- ✅ Navigation works
- ✅ Messages in correct language
- ✅ Preference remembered

---

## Mobile Responsiveness Scenarios

### Scenario 17: Mobile View

**Objective**: Verify app works on mobile

**Steps**:
1. Open app on mobile browser
2. View events list
3. Register for event
4. Download certificate
5. Check menu navigation
6. Verify touch interactions work

**Expected Result**:
- ✅ Layout responsive
- ✅ Buttons easily clickable
- ✅ Forms work on mobile
- ✅ Downloads work

---

## Cross-Browser Scenarios

### Scenario 18: Browser Compatibility

**Browsers to Test**:
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

**Steps**:
1. Test critical flows in each browser
2. Verify no console errors
3. Check CSS renders correctly
4. Test file uploads/downloads

**Expected Result**:
- ✅ Works in all browsers
- ✅ No JavaScript errors
- ✅ Consistent appearance

---

## Related Documentation

- [Testing Guide](./13-Testing-Guide.md)
- [Troubleshooting - Testing](./15-Troubleshooting.md#testing-issues)
- [API Reference](./10-API-Reference.md)

---

**Need help?** Check [Troubleshooting](./15-Troubleshooting.md)
