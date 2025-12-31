# Certificates Guide

Complete guide to certificate generation, verification, and management in JoinUp.

---

## Certificate Overview

Certificates are digital PDF documents issued to participants who attended an event. Each certificate includes:
- Participant's name
- Event title and date
- QR code for verification
- Unique certificate ID
- Issuance date and signature

Certificates serve as proof of attendance and achievement.

---

## Certificate Generation

### Prerequisites for Certificate Issuance

Before a certificate can be issued, all of the following must be true:

1. **Event Completed** ✅
   - Event end date has passed
   - Event status changed to "Completed"

2. **Participant Registered** ✅
   - Participant registered for the event before it started
   - Registration still exists in system

3. **Attendance Marked** ✅
   - Participant marked as present/attended
   - Checkbox is checked in attendance tab

4. **Not Already Issued** ✅
   - Certificate hasn't been issued for this participant
   - Each participant gets max one certificate per event

### Who Can Issue Certificates

**Permissions:**
- **Staff**: Can issue for events they created
- **Admin**: Can issue for any event

### How to Issue Certificates

#### Single Certificate

1. **Navigate to Event**
   - Go to Events page
   - Click "View" on completed event

2. **Go to Certificates Tab**
   - Click "Certificates" tab in event detail
   - See list of attended participants

3. **Issue Certificate**
   - Find participant without certificate
   - Click "Issue" or "Generate" button
   - System generates PDF with QR code
   - Confirmation appears

4. **Notify Participant**
   - Send email link to download
   - Or participant finds certificate in their dashboard

#### Bulk Issue All Certificates

1. Go to event Certificates tab
2. Click "Issue All" button
3. System generates certificates for all attendees
4. Progress bar shows generation status
5. Confirmation shows count issued

### Certificate Contents

Each PDF certificate includes:

```
╔════════════════════════════════════════════╗
║           CERTIFICATE OF ATTENDANCE        ║
║                                            ║
║  This certifies that                        ║
║                                            ║
║  John Smith                                 ║
║                                            ║
║  Has successfully attended the event:      ║
║                                            ║
║  "Angular Advanced Workshop"               ║
║  Held on December 15, 2025                 ║
║                                            ║
║  Certificate ID: CERT-2025-00123           ║
║  Issued: December 16, 2025                 ║
║                                            ║
║  [QR CODE]                                 ║
║                                            ║
║  Verify at: https://joinup.app/verify/123  ║
╚════════════════════════════════════════════╝
```

**Data Included:**
- Participant name
- Event title
- Event date
- Certificate ID (unique)
- Issue date
- JoinUp branding/logo
- QR code linking to verification

---

## Certificate Download

### For Participants

**Where to Find Certificates:**

1. **Events Page**
   - Login as participant
   - Go to "Events" or "My Events"
   - Find completed events you attended
   - Look for "Certificate" button

2. **Download Certificate**
   - Click "Certificate" button
   - PDF downloads automatically
   - Save to computer
   - Print if desired

3. **Multiple Events**
   - Can download certificates for multiple events
   - One certificate per event
   - All certificates saved locally

### File Format & Storage

**Format:**
- PDF (Portable Document Format)
- Compatible with all devices/browsers
- Can be printed or displayed digitally

**Storage:**
- Downloaded to your Downloads folder
- Recommended: Save to Documents folder
- Cloud backup recommended for important documents

### Using Your Certificate

**Displaying:**
- Email to employers
- Add to LinkedIn profile
- Include in resume
- Share on social media
- Print and frame

**Printed Certificate:**
- Fold and carry in wallet
- Frame for office/home
- Use as diploma replacement
- Physical proof of achievement

---

## Certificate Verification

### What is Verification?

Certificate verification confirms that:
- Certificate was issued by JoinUp
- Participant actually attended
- Certificate hasn't been tampered with
- All details are authentic

### How to Verify

#### Method 1: Using QR Code

1. Take photo/screenshot of QR code
2. Scan with smartphone
3. Automatically opens verification page
4. Shows certificate details if valid
5. Shows "Invalid" if tampered

#### Method 2: Using Certificate ID

1. Go to Verification page
2. Enter Certificate ID: CERT-2025-00123
3. Click "Verify"
4. System displays certificate details if valid

#### Method 3: Direct URL

1. Verification link in certificate: https://joinup.app/verify/123
2. Click link
3. Automatically loads certificate details

### Verification Results

**Valid Certificate Shows:**
- ✅ Participant name
- ✅ Event title and date
- ✅ Certificate ID
- ✅ Issue date
- ✅ "Certificate Valid" message

**Invalid Certificate Shows:**
- ❌ "Invalid Certificate ID"
- ❌ Error message
- ❌ No certificate details
- ❌ Suggestion to contact issuer

---

## Certificate Management

### Viewing Certificate List

**For Staff/Admin:**

1. Go to event detail page
2. Click "Certificates" tab
3. See list of all participants with certificate status

**List Shows:**
- Participant name
- Certificate status (Issued/Not Issued)
- Issue date (if issued)
- Certificate ID (if issued)
- Actions (Issue/Reissue/Delete)

### Reissuing Certificates

**Why Reissue:**
- Participant lost the file
- PDF corrupted
- Participant requests new copy
- Design/content updated

**How to Reissue:**

1. Go to event Certificates tab
2. Find participant with existing certificate
3. Click "Reissue" button
4. New PDF generated with new issue date
5. Old certificate remains valid
6. Send link to participant

### Certificate Retention

**Permanent Storage:**
- Certificates remain accessible indefinitely
- Can always re-download
- Can be reissued if lost

**Deletion:**
- Admin can delete certificate if needed
- Rare - only for duplicates/errors
- Action logged in audit trail

---

## Certificate Delivery

### Participant Download

1. Participant logs in
2. Goes to My Events or Events page
3. Finds completed event
4. Clicks "Download Certificate"
5. PDF saves to computer

### Email Delivery

**Manual Email:**
1. Generate certificate
2. Download PDF
3. Send via email to participant
4. Participant saves attachment

**Automated Email (if configured):**
1. System automatically sends upon generation
2. Participant receives email with download link
3. Link valid for 30 days (customizable)

### Bulk Distribution

**For Multiple Certificates:**
1. Issue all certificates for event
2. Get list of participant emails
3. Send bulk email with all links
4. Or mail individual PDFs

---

## Certificate Analytics

### Viewing Statistics

**Certificate Dashboard Shows:**
- Total certificates issued
- Events with certificates
- Participation rates
- Popular events

**For Each Event:**
- Certificates issued (count)
- Participants attended (count)
- Certificate rate (percentage attended)

### Reporting

**Available Reports:**
- Certificates issued by date range
- Certificates by event
- Participants per certificate
- Verification count (QR scans)

---

## Best Practices

### Issuance
- ✅ Issue promptly after event completion
- ✅ Verify attendance data is accurate
- ✅ Issue to all attendees
- ✅ Send availability notification
- ❌ Don't issue to no-shows
- ❌ Don't issue before event completion

### Verification
- ✅ Verify before trusting certificate
- ✅ Check QR code scans to verification
- ✅ Compare participant name carefully
- ✅ Check event name and date
- ❌ Don't assume screenshots are authentic
- ❌ Don't rely on PDF alone

### Security
- ✅ Keep certificate ID secret
- ✅ Use secure delivery method
- ✅ Archive certificates for records
- ✅ Maintain audit trail
- ❌ Don't modify certificate PDFs
- ❌ Don't share verification links publicly

---

## Troubleshooting

### Can't Issue Certificate

**Possible Reasons:**
- Event not completed yet
- Participant marked as absent
- Participant didn't register
- Certificate already issued

**Solutions:**
- Wait for event to end and be marked complete
- Mark participant as attended in attendance tab
- Ensure participant registered
- Reissue if already issued

### Certificate Won't Download

**Possible Reasons:**
- PDF generation failed
- Network connection lost
- Browser blocked download

**Solutions:**
- Try again
- Check internet connection
- Allow pop-ups in browser
- Try different browser
- Contact administrator

### Verification Shows Invalid

**Possible Reasons:**
- Wrong Certificate ID
- Certificate revoked
- PDF modified/tampered with
- System error

**Solutions:**
- Double-check certificate ID
- Try QR code instead of ID
- Contact administrator if actual certificate
- Report fraud if suspicious

### QR Code Not Working

**Possible Reasons:**
- QR code damaged
- Photo out of focus
- Wrong QR scanner app
- Link expired (unlikely)

**Solutions:**
- Try clearer photo
- Use different QR scanner app
- Use Certificate ID to verify manually
- Contact administrator

---

## API Reference

See [API Documentation](./10-API-Reference.md#certificates) for:
- `POST /certificates/issue/:registrationId` - Issue certificate
- `GET /certificates/verify/:registrationId?code=X` - Verify certificate

---

## Related Documentation

- [Event Management](./04-Event-Management.md)
- [Attendance Tracking](./06-Attendance-Tracking.md)
- [API Reference](./10-API-Reference.md#certificates)

---

**Need help?** Check [Troubleshooting - Certificates](./15-Troubleshooting.md#certificate-issues)
