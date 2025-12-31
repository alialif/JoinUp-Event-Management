# API Reference

Complete documentation of all REST API endpoints in JoinUp.

---

## Base URL

```
http://localhost:3000
```

### API Documentation

Interactive API documentation available at:
```
http://localhost:3000/api/docs
```

Browse and test all endpoints directly in Swagger UI.

---

## Authentication

### Login

**Endpoint**: `POST /auth/login`

**Description**: Authenticate user and receive JWT token

**Request Body**:
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response** (200 OK):
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "member": {
    "id": 1,
    "email": "user@example.com",
    "name": "John Smith",
    "role": "participant"
  }
}
```

**Error Responses**:
- `400 Bad Request`: Missing email or password
- `401 Unauthorized`: Invalid credentials

---

### Register

**Endpoint**: `POST /auth/register`

**Description**: Register a new user account

**Request Body**:
```json
{
  "name": "John Smith",
  "email": "john@example.com",
  "password": "securePass123",
  "birthDate": "1990-05-15",
  "gender": "male"
}
```

**Response** (201 Created):
```json
{
  "id": 1,
  "email": "john@example.com",
  "name": "John Smith",
  "birthDate": "1990-05-15",
  "gender": "male",
  "role": "participant",
  "createdAt": "2025-12-10T10:30:00Z"
}
```

**Error Responses**:
- `400 Bad Request`: Validation failed (email exists, invalid format, etc.)

---

### Get All Members

**Endpoint**: `GET /auth/members`

**Description**: List all registered users (Admin only)

**Query Parameters**:
```
?limit=50&offset=0
```

**Response** (200 OK):
```json
{
  "data": [
    {
      "id": 1,
      "email": "admin@bootcamp.com",
      "name": "Administrator",
      "role": "admin",
      "createdAt": "2025-12-01T00:00:00Z"
    },
    {
      "id": 2,
      "email": "user@example.com",
      "name": "John Smith",
      "role": "participant",
      "createdAt": "2025-12-10T10:30:00Z"
    }
  ],
  "total": 2,
  "limit": 50,
  "offset": 0
}
```

**Authorization**: Requires `Authorization: Bearer <token>`  
**Role Required**: Admin

---

### Change User Role

**Endpoint**: `PUT /auth/members/:memberId/role`

**Description**: Change a user's role (Admin only)

**URL Parameters**:
```
memberId: 2  (ID of user to modify)
```

**Request Body**:
```json
{
  "role": "staff"
}
```

**Valid Roles**: `"participant"`, `"staff"`, `"admin"`

**Response** (200 OK):
```json
{
  "id": 2,
  "email": "user@example.com",
  "name": "John Smith",
  "role": "staff",
  "updatedAt": "2025-12-10T11:00:00Z"
}
```

**Authorization**: Requires `Authorization: Bearer <token>`  
**Role Required**: Admin

---

## Events

### List Events

**Endpoint**: `GET /events`

**Description**: Get all events (paginated)

**Query Parameters**:
```
?limit=10&offset=0&status=upcoming&category=workshop
```

**Response** (200 OK):
```json
{
  "data": [
    {
      "id": 1,
      "title": "Angular Advanced Workshop",
      "description": "Learn advanced Angular concepts",
      "startDate": "2025-12-15T09:00:00Z",
      "endDate": "2025-12-15T17:00:00Z",
      "location": "Room 101",
      "capacity": 50,
      "categories": ["workshop", "conference"],
      "price": 0,
      "registrationCount": 25,
      "createdBy": 1,
      "createdAt": "2025-12-10T10:30:00Z"
    }
  ],
  "total": 1,
  "limit": 10,
  "offset": 0
}
```

---

### Create Event

**Endpoint**: `POST /events`

**Description**: Create a new event (Staff/Admin only)

**Request Body**:
```json
{
  "title": "Angular Advanced Workshop",
  "description": "Learn advanced Angular concepts including RxJS and state management",
  "location": "Room 101",
  "startDate": "2025-12-15T09:00:00Z",
  "endDate": "2025-12-15T17:00:00Z",
  "capacity": 50,
  "categories": ["workshop", "conference"],
  "price": 0
}
```

**Response** (201 Created):
```json
{
  "id": 1,
  "title": "Angular Advanced Workshop",
  "description": "Learn advanced Angular concepts...",
  "location": "Room 101",
  "startDate": "2025-12-15T09:00:00Z",
  "endDate": "2025-12-15T17:00:00Z",
  "capacity": 50,
  "categories": ["workshop", "conference"],
  "price": 0,
  "createdBy": 1,
  "createdAt": "2025-12-10T10:30:00Z"
}
```

**Authorization**: Requires `Authorization: Bearer <token>`  
**Role Required**: Staff, Admin

---

### Get Event Details

**Endpoint**: `GET /events/:eventId`

**Description**: Get detailed information about a specific event

**URL Parameters**:
```
eventId: 1
```

**Response** (200 OK):
```json
{
  "id": 1,
  "title": "Angular Advanced Workshop",
  "description": "Learn advanced Angular concepts...",
  "location": "Room 101",
  "startDate": "2025-12-15T09:00:00Z",
  "endDate": "2025-12-15T17:00:00Z",
  "capacity": 50,
  "registrationCount": 25,
  "categories": ["workshop", "conference"],
  "price": 0,
  "createdBy": 1,
  "createdAt": "2025-12-10T10:30:00Z",
  "updatedAt": "2025-12-10T15:00:00Z"
}
```

---

### Update Event

**Endpoint**: `PUT /events/:eventId`

**Description**: Update event details (Staff who created it or Admin)

**URL Parameters**:
```
eventId: 1
```

**Request Body**: (all fields optional)
```json
{
  "title": "Angular Advanced Workshop - Updated",
  "description": "Updated description",
  "capacity": 60
}
```

**Response** (200 OK):
```json
{
  "id": 1,
  "title": "Angular Advanced Workshop - Updated",
  "description": "Updated description",
  "capacity": 60,
  "updatedAt": "2025-12-10T15:00:00Z"
}
```

**Authorization**: Requires `Authorization: Bearer <token>`  
**Role Required**: Staff (creator only), Admin

---

### Delete Event

**Endpoint**: `DELETE /events/:eventId`

**Description**: Delete an event (Admin only)

**URL Parameters**:
```
eventId: 1
```

**Response** (204 No Content)

**Authorization**: Requires `Authorization: Bearer <token>`  
**Role Required**: Admin

---

## Registrations

### Register Member for Event

**Endpoint**: `POST /registrations/:eventId/member/:memberId`

**Description**: Register a member for an event

**URL Parameters**:
```
eventId: 1
memberId: 5
```

**Request Body**: Empty or minimal payload

**Response** (201 Created):
```json
{
  "id": 1,
  "eventId": 1,
  "memberId": 5,
  "registeredAt": "2025-12-10T10:30:00Z",
  "status": "registered"
}
```

**Error Responses**:
- `400 Bad Request`: Event already started, at capacity, or already registered
- `404 Not Found`: Event or member not found

---

### Get Event Registrations

**Endpoint**: `GET /registrations/event/:eventId`

**Description**: List all registrations for an event

**URL Parameters**:
```
eventId: 1
```

**Query Parameters**:
```
?limit=50&offset=0
```

**Response** (200 OK):
```json
{
  "data": [
    {
      "id": 1,
      "eventId": 1,
      "memberId": 5,
      "member": {
        "id": 5,
        "name": "John Smith",
        "email": "john@example.com"
      },
      "registeredAt": "2025-12-10T10:30:00Z",
      "status": "registered"
    }
  ],
  "total": 1,
  "limit": 50,
  "offset": 0
}
```

---

## Attendance

### Mark Attendance

**Endpoint**: `POST /attendance/mark/:eventId/member/:memberId`

**Description**: Mark a member as attended for an event

**URL Parameters**:
```
eventId: 1
memberId: 5
```

**Request Body**:
```json
{
  "attended": true
}
```

**Response** (201 Created or 200 OK):
```json
{
  "id": 1,
  "eventId": 1,
  "memberId": 5,
  "attended": true,
  "markedAt": "2025-12-15T17:30:00Z"
}
```

**Authorization**: Requires `Authorization: Bearer <token>`  
**Role Required**: Staff (creator of event), Admin

---

### Get Event Attendance

**Endpoint**: `GET /attendance/event/:eventId`

**Description**: Get attendance list for an event

**URL Parameters**:
```
eventId: 1
```

**Query Parameters**:
```
?limit=50&offset=0
```

**Response** (200 OK):
```json
{
  "data": [
    {
      "id": 1,
      "eventId": 1,
      "memberId": 5,
      "member": {
        "id": 5,
        "name": "John Smith",
        "email": "john@example.com"
      },
      "attended": true,
      "markedAt": "2025-12-15T17:30:00Z"
    }
  ],
  "total": 1,
  "limit": 50,
  "offset": 0
}
```

---

## Certificates

### Issue Certificate

**Endpoint**: `POST /certificates/issue/:registrationId`

**Description**: Generate and issue a certificate for a registration

**URL Parameters**:
```
registrationId: 1
```

**Request Body**: Empty or minimal payload

**Response** (201 Created):
```json
{
  "id": 1,
  "registrationId": 1,
  "memberId": 5,
  "eventId": 1,
  "certificateCode": "CERT-2025-00123",
  "pdfUrl": "/certificates/CERT-2025-00123.pdf",
  "issuedAt": "2025-12-16T10:00:00Z",
  "qrCode": "data:image/png;base64,..."
}
```

**Error Responses**:
- `400 Bad Request`: Member not attended, event not completed, or certificate already issued
- `404 Not Found`: Registration not found

**Authorization**: Requires `Authorization: Bearer <token>`  
**Role Required**: Staff, Admin

---

### Verify Certificate

**Endpoint**: `GET /certificates/verify/:registrationId`

**Description**: Verify a certificate by ID or code

**URL Parameters**:
```
registrationId: 1
```

**Query Parameters**:
```
?code=CERT-2025-00123
```

**Response** (200 OK):
```json
{
  "valid": true,
  "certificateCode": "CERT-2025-00123",
  "memberName": "John Smith",
  "eventTitle": "Angular Advanced Workshop",
  "eventDate": "2025-12-15T09:00:00Z",
  "issuedAt": "2025-12-16T10:00:00Z"
}
```

**Error Response** (404 Not Found):
```json
{
  "valid": false,
  "message": "Certificate not found"
}
```

---

## Audit

### Get Audit Logs

**Endpoint**: `GET /audit`

**Description**: Get system audit logs (Staff/Admin only)

**Query Parameters**:
```
?limit=100&offset=0&startDate=2025-12-01&endDate=2025-12-31&entityType=event&action=create
```

**Response** (200 OK):
```json
{
  "data": [
    {
      "id": 1,
      "timestamp": "2025-12-10T10:30:00Z",
      "action": "create",
      "entityType": "event",
      "entityId": 1,
      "userId": 1,
      "userName": "Administrator",
      "details": {
        "title": "Angular Workshop",
        "capacity": 50
      }
    }
  ],
  "total": 1,
  "limit": 100,
  "offset": 0
}
```

**Authorization**: Requires `Authorization: Bearer <token>`  
**Role Required**: Staff, Admin

---

## Error Handling

### Standard Error Response

```json
{
  "statusCode": 400,
  "message": "Validation failed",
  "error": "Bad Request",
  "details": [
    {
      "field": "email",
      "message": "Email must be valid"
    }
  ]
}
```

### Common Status Codes

| Code | Meaning |
|------|---------|
| `200` | OK - Request successful |
| `201` | Created - Resource created successfully |
| `204` | No Content - Successful, no response body |
| `400` | Bad Request - Invalid input/validation error |
| `401` | Unauthorized - Missing or invalid token |
| `403` | Forbidden - Insufficient permissions |
| `404` | Not Found - Resource not found |
| `409` | Conflict - Resource already exists |
| `500` | Internal Server Error - Server error |

---

## Request Headers

### Required Headers

**All Authenticated Requests**:
```
Authorization: Bearer <jwt_token>
Content-Type: application/json
```

### Optional Headers

```
Accept-Language: en or fr-CA
X-Request-ID: <unique_id>
```

---

## Rate Limiting

Currently not implemented. Recommended for production:
- Implement per-user rate limits
- Global API rate limit
- Return `429 Too Many Requests` when exceeded

---

## Pagination

### Default Parameters

```
limit: 50 (maximum items per page)
offset: 0 (starting position)
```

### Response Format

```json
{
  "data": [...],
  "total": 100,
  "limit": 50,
  "offset": 0
}
```

### Calculating Pages

```
totalPages = Math.ceil(total / limit)
currentPage = (offset / limit) + 1
nextOffset = offset + limit
```

---

## Filtering & Searching

### Query Parameter Patterns

**By Status**:
```
GET /events?status=upcoming
GET /events?status=completed
```

**By Category**:
```
GET /events?category=workshop
```

**By Date Range**:
```
GET /events?startDate=2025-12-01&endDate=2025-12-31
```

**Multiple Filters**:
```
GET /events?status=upcoming&category=workshop&limit=25&offset=0
```

---

## Testing the API

### Using curl

**Login**:
```bash
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@bootcamp.com","password":"admin123"}'
```

**Get Events**:
```bash
curl http://localhost:3000/events \
  -H "Authorization: Bearer <token>"
```

**Create Event**:
```bash
curl -X POST http://localhost:3000/events \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"title":"Workshop","description":"Test","startDate":"2025-12-15T09:00:00Z","endDate":"2025-12-15T17:00:00Z","capacity":30}'
```

### Using Postman

1. Import Swagger JSON from `http://localhost:3000/api-json`
2. Set variable: `base_url = http://localhost:3000`
3. Login endpoint to get token
4. Use token in subsequent requests
5. Test endpoints with provided examples

---

## Related Documentation

- [Architecture Overview](./09-Architecture.md)
- [Database Schema](./11-Database-Schema.md)
- [Event Management](./04-Event-Management.md)
- [Testing Guide](./13-Testing-Guide.md)

---

**Need help?** Check [Troubleshooting - API](./15-Troubleshooting.md#api-issues)
