# Attendance Tracking Guide

Complete guide to marking, managing, and tracking event attendance in JoinUp.

---

## Attendance Overview

Attendance tracking allows staff and administrators to record which participants actually attended an event. This information is essential for:
- Issuing certificates only to attendees
- Maintaining accurate event records
- Generating attendance reports
- Analytics and statistics

---

## Marking Attendance

### Permissions Required
- **Staff**: Can mark attendance for events they created
- **Admin**: Can mark attendance for any event

### How to Mark Attendance

1. **Navigate to Event Detail**
   - Go to Events page
   - Click "View" on the desired event
   - Event detail page opens

2. **Go to Attendance Tab**
   - Click "Attendance" tab in event detail page
   - See list of all registered participants

3. **Toggle Attendance**
   - Find participant in list
   - Use checkbox next to their name
   - ✅ Checked = Present
   - ☐ Unchecked = Absent

4. **Save Changes**
   - Changes save automatically (or click Save button)
   - Confirmation message appears
   - System logs the action in audit trail

### Attendance List Display

The attendance list shows:

| Column | Description |
|--------|-------------|
| **Name** | Participant's full name |
| **Email** | Participant's email address |
| **Registered Date** | When they registered for event |
| **Status** | ✅ Present / ☐ Absent |
| **Certificate** | Status of certificate issuance |

---

## Attendance Rules & Restrictions

### When Attendance Can Be Marked

**Can Mark:**
- ✅ While event is in progress
- ✅ After event has ended
- ✅ For past events (historical correction)
- ✅ For future events (preparation, then finalize)

**Cannot Mark:**
- ❌ For events that haven't started yet (best practice)
- ❌ For unregistered participants (must register first)

### Bulk Operations

**Mark All Present:**
- Use "Mark All" button to mark entire group as attended
- Useful for small, mandatory events
- Can then uncheck exceptions

**Mark All Absent:**
- Use "Clear All" button to reset all to absent
- Useful when starting fresh

**Selective Marking:**
- Click individual checkboxes
- Mark only those who attended
- Most common method

---

## Attendance Scenarios

### Scenario 1: Small Workshop (Everyone Attended)

1. Event ends
2. Go to Attendance tab
3. Click "Mark All" button
4. Review list
5. Uncheck anyone who wasn't present
6. Save

### Scenario 2: Large Conference (Selective Attendance)

1. Use sign-in sheet during event
2. After event, go to Attendance tab
3. Systematically go through list
4. Check names from sign-in sheet
5. Leave unchecked those not signed in
6. Save

### Scenario 3: Attendance Correction

1. Months after event, discover error
2. Go to event Attendance tab
3. Find participant with incorrect status
4. Toggle checkbox to correct
5. Save change
6. Correction logged in audit trail

---

## Attendance & Certificates

### Certificate Prerequisites

Before a certificate can be issued, participant must:
1. **Registered** for the event ✅
2. **Attended** the event (marked present) ✅
3. Event must be **completed** ✅

### Workflow: From Attendance to Certificate

1. **Event Occurs** → Participants register and attend
2. **Mark Attendance** → Staff marks who was present
3. **Event Ends** → Changes event status to Completed
4. **Issue Certificates** → Staff generates PDFs for attendees
5. **Download** → Participants download their certificates

### Cannot Issue Certificate If:
- ❌ Participant not registered
- ❌ Participant marked as absent
- ❌ Event not completed
- ❌ Certificate already issued (prevents duplicates)

---

## Attendance Reports

### Viewing Attendance Statistics

**On Attendance Tab:**
- Shows attendance count: "23 out of 50 attended"
- Shows attendance percentage: "46%"
- Shows absent count
- Shows no-show participants

### Attendance Metrics

**Key Metrics:**
- Total registered: 50
- Total attended: 23
- Attendance rate: 46%
- Absent: 27
- No-shows: 2 (registered but didn't attend)

### Exporting Attendance

**Current Features:**
- View in UI
- Print page (uses browser print functionality)
- Export via API (JSON format)

**Future Features:**
- Export to CSV
- Export to Excel
- Generate PDF report

---

## Attendance Best Practices

### During Event

**Before Event Starts:**
- Prepare participant list
- Print attendance sheet
- Set up sign-in table

**During Event:**
- Have participants sign in
- Collect contact info for new participants
- Note any late arrivals

**End of Event:**
- Do final count
- Confirm all present signed in
- Note any early departures

### Marking Attendance

- ✅ Mark within 24 hours of event (memory fresh)
- ✅ Double-check list for accuracy
- ✅ Verify participants actually attended
- ✅ Keep sign-in sheet for record
- ❌ Don't mark absent participants as present
- ❌ Don't estimate, use accurate records

### Certificate Issuance

- ✅ Verify attendance before issuing
- ✅ Issue promptly after event completion
- ✅ Keep certificates available for download
- ✅ Verify via QR code before issuing (optional)

---

## Attendance & No-Shows

### Handling No-Shows

**No-Show Definition:**
- Participant registered for event
- Event occurred
- Participant did not attend
- No advance notice

**Recording No-Shows:**
- Mark as absent (unchecked)
- Add note if system supports comments
- Consider contacting participant

**Follow-Up Actions:**
- Send email asking about absence
- Provide opportunity to attend makeup event
- Update participant status if needed
- Use for event planning metrics

---

## Attendance Troubleshooting

### Can't Find Participant in Attendance List

**Possible Reasons:**
- They didn't register for event
- They registered for different event
- Account deleted

**Solutions:**
- Check event registration tab first
- Verify participant registered for correct event
- Have admin add registration if needed

### Can't Mark Attendance

**Possible Reasons:**
- Event hasn't happened yet (best practice restriction)
- Not a staff/admin member of event
- Database connection issue

**Solutions:**
- Wait until event is in progress or completed
- Verify you have staff role for event
- Try refreshing page

### Changes Not Saving

**Possible Reasons:**
- Network connection lost
- Server error
- Invalid session

**Solutions:**
- Check internet connection
- Try again
- Refresh page and login again
- Contact system administrator

---

## API Reference

See [API Documentation](./10-API-Reference.md#attendance) for:
- `POST /attendance/mark/:eventId/member/:memberId` - Mark attendance
- `GET /attendance/event/:eventId` - Get event attendance list

---

## Related Documentation

- [Event Management](./04-Event-Management.md)
- [Certificates](./07-Certificates.md)
- [API Reference](./10-API-Reference.md#attendance)

---

**Need help?** Check [Troubleshooting - Attendance](./15-Troubleshooting.md#attendance-issues)
