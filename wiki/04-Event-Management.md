# Event Management Guide

Complete guide to creating, managing, and organizing events in JoinUp.

---

## Event Overview

Events are the core entities in JoinUp. They represent activities that members can register for, attend, and receive certificates for upon completion.

### Event Lifecycle

```
DRAFT → OPEN → IN PROGRESS → COMPLETED
         ↓
    CANCELLED (optional)
```

- **DRAFT/OPEN**: Members can register
- **IN PROGRESS**: Members can be marked as attended
- **COMPLETED**: Certificates can be downloaded
- **CANCELLED**: No registrations allowed

---

## Creating an Event

### Required Permissions
- Staff or Admin role

### Step-by-Step

1. **Navigate to Events**
   - Login with Staff or Admin account
   - Click "Events" in navigation

2. **Click "Create Event"**
   - Button visible in top-right of Events page

3. **Fill Event Information**

   **Basic Details:**
   - **Title** (required): Event name (e.g., "Angular Workshop 2025")
   - **Description** (required): Event details and agenda
   - **Location** (optional): Where the event takes place

   **Date & Time:**
   - **Start Date & Time** (required): When event begins
   - **End Date & Time** (required): When event ends
   - End date must be after start date

   **Capacity:**
   - **Maximum Capacity** (required): Number of attendees
   - Prevents overbooking

   **Categories** (select one or more):
   - ☑️ Conference
   - ☑️ Workshop
   - ☑️ Meetup
   - ☑️ Webinar

   **Pricing:**
   - ⭕ Free Event
   - ⭕ Paid Event (enter price)

4. **Review & Create**
   - Verify all information
   - Click "Create Event"
   - Success message appears
   - Event appears in Events list

---

## Viewing Events

### As Any User

**Events List View:**
- Shows all upcoming and past events
- Displays title, date, capacity, and category
- Shows registration status

**Event Detail View:**
- Click "View" on any event
- Shows full event information
- Displays registrations count
- Shows action buttons based on role

### Filtering & Searching

**Current Filters:**
- Status (Upcoming/Completed)
- Category (Conference, Workshop, etc.)
- Date range

---

## Editing Events

### Permissions
- Staff: Can edit only events they created
- Admin: Can edit any event

### How to Edit

1. Go to event detail page
2. Click "Edit" button
3. Modify event information
4. Click "Save"
5. Changes take effect immediately

### What Can Be Changed
- ✅ Title, description, location
- ✅ Dates and times
- ✅ Capacity
- ✅ Categories
- ✅ Pricing
- ⚠️ Cannot change after event starts (participants already registered)

---

## Deleting Events

### Permissions
- Admin only

### How to Delete

1. Go to event detail page
2. Click "Delete" button (red button)
3. Confirm deletion
4. Event removed from system
5. All registrations also deleted

### Consequences
- Participants lose registration
- Certificates issued remain valid
- Audit log records deletion

---

## Event Status States

### Upcoming Events
- **Status**: Open for registration
- **Actions Available**: Register (Participant), Edit (Staff), Mark Attendance (Staff)
- **Registration**: ✅ Allowed
- **Attendance Marking**: ❌ Not yet

### In-Progress Events
- **Status**: Event is currently happening
- **Actions Available**: Mark Attendance (Staff), View Registrations
- **Registration**: ❌ Closed
- **Attendance Marking**: ✅ Available

### Completed Events
- **Status**: Event has ended
- **Actions Available**: Download Certificate (Participant), Issue Certificate (Staff)
- **Registration**: ❌ Closed
- **Attendance Marking**: ❌ Closed
- **Certificate**: ✅ Available

---

## Event Registrations

### Participant Perspective

**Registering for an Event:**
1. Click "View" on event
2. Click "Register" button (only if event hasn't started)
3. Confirmation message shows
4. Button changes to "You are already registered"

**Viewing Registrations:**
- Dashboard shows "My Events"
- Lists all registered events
- Color-coded by status

### Staff/Admin Perspective

**Viewing Event Registrations:**
1. Open event detail page
2. See "Registrations" count and list
3. View all registered participants
4. Click on participant for details

**Registrations List Shows:**
- Participant name and email
- Registration date
- Attendance status (if applicable)
- Certificate status

---

## Event Categories

Events can be tagged with one or more categories:

| Category | Purpose | Typical Duration |
|----------|---------|------------------|
| **Conference** | Large formal events with presentations | 1-3 days |
| **Workshop** | Hands-on learning sessions | 2-8 hours |
| **Meetup** | Casual networking/discussion groups | 1-2 hours |
| **Webinar** | Online educational sessions | 1-2 hours |

### Multi-Category Events
- Events can have multiple categories
- Use categories to help members find relevant events
- Filter/search by category in the UI

---

## Event Pricing

### Free Events
- No cost to register
- Members can register without payment info
- Certificates still issued for attended members

### Paid Events
- Entry fee required
- Price displayed in event listing
- Integration with payment (if configured)
- Participants must pay to register

---

## Capacity Management

**Maximum Capacity:**
- Define when creating event
- Prevents overbooking
- Shows available spots in listing
- Registration disabled when full

**Viewing Capacity:**
- Event list shows: "45/50 registered" (45 out of 50 spots filled)
- Event detail shows capacity bar

**Handling Overflow:**
- Waitlist functionality (if configured)
- Manual registration by admins can bypass limit

---

## Event Statistics

### For Staff/Admin

View event analytics:
- Total registrations
- Attendance rate
- Certificate issued count
- Popular categories
- Revenue (if paid events)

### Accessing Statistics

1. Open event detail page
2. Look for "Statistics" section
3. View key metrics

---

## Best Practices

### Event Creation
- ✅ Use clear, descriptive titles
- ✅ Provide detailed descriptions
- ✅ Set realistic capacity limits
- ✅ Plan dates with buffer time
- ✅ Assign appropriate categories

### Event Management
- ✅ Review registrations before event
- ✅ Send reminders to participants
- ✅ Start event on time
- ✅ Mark attendance accurately
- ✅ Issue certificates promptly after completion

### Event Promotion
- ✅ Use multiple categories for discoverability
- ✅ Write engaging descriptions
- ✅ Set appropriate dates for target audience
- ✅ Monitor capacity and adjust if needed

---

## API Reference

See [API Documentation](./10-API-Reference.md#events) for:
- `/GET /events` - List all events
- `/POST /events` - Create event
- `/GET /events/:id` - Get event details
- `/PUT /events/:id` - Update event
- `/DELETE /events/:id` - Delete event

---

## Related Documentation

- [Member Registration Guide](./05-Member-Registration.md)
- [Attendance Tracking](./06-Attendance-Tracking.md)
- [Certificates](./07-Certificates.md)
- [API Reference](./10-API-Reference.md)

---

**Need help?** Check [Troubleshooting - Events](./15-Troubleshooting.md#event-management)
