# Code Style Guide

Coding standards, conventions, and best practices for JoinUp.

---

## General Principles

- **Consistency**: Follow existing patterns in codebase
- **Clarity**: Write code that's easy to understand
- **Maintainability**: Think of next developer
- **DRY**: Don't Repeat Yourself
- **SOLID**: Follow SOLID principles where applicable

---

## TypeScript / JavaScript

### Naming Conventions

**Variables & Functions** (camelCase):
```typescript
// ✅ Good
const userName = 'John';
const getUserById = (id: number) => { };
let isActive = true;

// ❌ Avoid
const user_name = 'John';
const GetUserById = (id: number) => { };
const ISACTIVE = true;
```

**Classes & Interfaces** (PascalCase):
```typescript
// ✅ Good
class EventService { }
interface User { }
enum EventStatus { }

// ❌ Avoid
class eventService { }
interface user { }
enum event_status { }
```

**Constants** (UPPER_SNAKE_CASE):
```typescript
// ✅ Good
const MAX_CAPACITY = 100;
const DEFAULT_TIMEOUT = 5000;
const API_BASE_URL = 'http://localhost:3000';

// ❌ Avoid
const maxCapacity = 100;
const default_timeout = 5000;
const apiBaseUrl = 'http://localhost:3000';
```

**File Names**:
```
// Components
component-name.component.ts

// Services
service-name.service.ts

// Guards
guard-name.guard.ts

// Interceptors
interceptor-name.interceptor.ts

// Models
model-name.model.ts

// Spec files
component.spec.ts
```

---

### Type Annotations

**Always Add Types**:
```typescript
// ✅ Good
function createEvent(title: string, capacity: number): Event {
  return { title, capacity };
}

const users: User[] = [];
const config: EventConfig = { };

// ❌ Avoid
function createEvent(title, capacity) {
  return { title, capacity };
}

const users = [];
const config = { };
```

**Use Interfaces**:
```typescript
// ✅ Good
interface User {
  id: number;
  name: string;
  email: string;
}

const user: User = { id: 1, name: 'John', email: 'john@example.com' };

// ❌ Avoid
const user: any = { id: 1, name: 'John', email: 'john@example.com' };
```

---

### Functions & Methods

**Arrow Functions for Simple Functions**:
```typescript
// ✅ Good
const add = (a: number, b: number): number => a + b;

// ❌ Avoid
const add = function(a: number, b: number): number {
  return a + b;
};
```

**Named Functions for Complex Logic**:
```typescript
// ✅ Good
function processEventRegistrations(event: Event): void {
  // Complex logic
  validateEvent(event);
  createRegistrations(event);
  sendNotifications(event);
}

// ❌ Avoid
const x = (e) => {
  // Complex logic here
};
```

**Single Responsibility**:
```typescript
// ✅ Good
function validateEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function sendWelcomeEmail(user: User): Promise<void> {
  // Send email logic
}

// ❌ Avoid
function processUser(user: User): Promise<boolean> {
  // Validate email
  // Send email
  // Create account
  // Do everything
}
```

---

## Angular Conventions

### Component Structure

**File Organization**:
```typescript
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';

// External services
import { AuthService } from '../../../core/auth.service';
import { LoadingService } from '../../../core/loading.service';

// Models & interfaces
import { User } from '../../../core/models';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  // 1. Properties/State
  form = this.fb.group({
    email: [''],
    password: [''],
  });

  // 2. Lifecycle hooks
  ngOnInit(): void {
    // Initialize
  }

  // 3. Public methods
  onLogin(): void {
    // Handle login
  }

  // 4. Private methods
  private validateForm(): boolean {
    // Validation logic
    return true;
  }

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private loadingService: LoadingService,
  ) {}
}
```

### Component Naming

```typescript
// ✅ Good
component-name.component.ts
template-name.component.html
styles.component.scss

// In component:
@Component({
  selector: 'app-event-list',  // Prefixed with 'app-'
  standalone: true,
})
export class EventListComponent { }

// ❌ Avoid
EventList.component.ts
event-list.ts
events.component.ts  // Generic name
```

### RxJS & Observables

**Use async Pipe**:
```typescript
// ✅ Good (in template)
<div>{{ (user$ | async)?.name }}</div>

// ✅ Good (with control flow)
@if (isLoading$ | async) {
  <app-spinner></app-spinner>
}

// ❌ Avoid (manual subscription in component)
user: User;
ngOnInit() {
  this.userService.getUser().subscribe(u => this.user = u);
}
// Memory leak if not unsubscribed!
```

**Unsubscribe Pattern**:
```typescript
// ✅ Good (with takeUntilDestroyed)
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

export class MyComponent {
  private destroy$ = new Subject<void>();

  ngOnInit(): void {
    this.dataService.data$
      .pipe(takeUntilDestroyed())
      .subscribe(data => this.handleData(data));
  }
}

// ❌ Avoid (without unsubscribe)
ngOnInit() {
  this.dataService.data$.subscribe(data => {
    this.data = data;
  }); // Memory leak!
}
```

---

## NestJS Conventions

### Service Organization

```typescript
// ✅ Good
@Injectable()
export class EventsService {
  constructor(
    @InjectRepository(Event)
    private eventsRepository: Repository<Event>,
    private auditService: AuditService,
  ) {}

  // Public methods (called by controllers)
  async create(createEventDto: CreateEventDto): Promise<Event> {
    // Validate
    this.validateEventDates(createEventDto);

    // Create
    const event = this.eventsRepository.create(createEventDto);
    const saved = await this.eventsRepository.save(event);

    // Log
    await this.auditService.log('create', 'event', saved.id);

    return saved;
  }

  // Private methods (internal logic)
  private validateEventDates(dto: CreateEventDto): void {
    if (dto.endDate <= dto.startDate) {
      throw new BadRequestException('End date must be after start date');
    }
  }
}
```

### Controller Organization

```typescript
// ✅ Good
@Controller('events')
@UseGuards(JwtAuthGuard)
export class EventsController {
  constructor(private eventsService: EventsService) {}

  @Get()
  @Public()  // Override guard
  async getAll(@Query() query: PaginationQuery): Promise<PaginatedResult<Event>> {
    return this.eventsService.findAll(query);
  }

  @Get(':id')
  async getById(@Param('id', ParseIntPipe) id: number): Promise<Event> {
    return this.eventsService.findById(id);
  }

  @Post()
  @Roles('staff', 'admin')
  async create(@Body() createEventDto: CreateEventDto): Promise<Event> {
    return this.eventsService.create(createEventDto);
  }

  @Put(':id')
  @Roles('staff', 'admin')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateEventDto: UpdateEventDto,
  ): Promise<Event> {
    return this.eventsService.update(id, updateEventDto);
  }

  @Delete(':id')
  @Roles('admin')
  async delete(@Param('id', ParseIntPipe) id: number): Promise<void> {
    await this.eventsService.delete(id);
  }
}
```

### DTO (Data Transfer Object)

```typescript
// ✅ Good
export class CreateEventDto {
  @IsString()
  @MinLength(3)
  @MaxLength(100)
  title: string;

  @IsString()
  @MinLength(10)
  description: string;

  @IsDateString()
  startDate: string;

  @IsDateString()
  endDate: string;

  @IsNumber()
  @Min(1)
  capacity: number;

  @IsArray()
  @ArrayMinSize(1)
  categories: string[];

  @IsNumber()
  @Min(0)
  price: number;
}

// ❌ Avoid
export class CreateEventDto {
  title: any;
  description: any;
  startDate: any;
  endDate: any;
  capacity: any;
  categories: any;
  price: any;
}
```

---

## HTML Templates

### Template Syntax

**Use Control Flow**:
```html
<!-- ✅ Good (Angular 17+) -->
@if (isLoading) {
  <app-spinner></app-spinner>
}

@if (event) {
  <div>{{ event.title }}</div>
} @else {
  <p>No event found</p>
}

<!-- ❌ Avoid (deprecated) -->
<div *ngIf="isLoading">
  <app-spinner></app-spinner>
</div>
```

**Use Built-in Directives**:
```html
<!-- ✅ Good -->
@for (item of items; track item.id) {
  <div>{{ item.name }}</div>
}

<!-- ❌ Avoid -->
<div *ngFor="let item of items">
  {{ item.name }}
</div>
```

**Event Binding**:
```html
<!-- ✅ Good -->
<button (click)="onSubmit()">Submit</button>
<input (change)="onValueChange($event)">

<!-- ❌ Avoid -->
<button onclick="onSubmit()">Submit</button>
<input onchange="onValueChange($event)">
```

### Template Naming

```html
<!-- ✅ Good: descriptive class names -->
<div class="event-card">
  <h2 class="event-card__title">{{ event.title }}</h2>
  <p class="event-card__description">{{ event.description }}</p>
  <button class="event-card__action">Register</button>
</div>

<!-- Data attributes for testing -->
<button 
  class="btn-primary" 
  (click)="register()" 
  [data-testid]="'register-button'">
  Register
</button>

<!-- ❌ Avoid: generic/unclear classes -->
<div class="container">
  <h2 class="header">{{ event.title }}</h2>
  <p class="text">{{ event.description }}</p>
  <button class="btn">Register</button>
</div>
```

---

## SCSS/CSS

### Class Naming (BEM)

```scss
// ✅ Good (Block Element Modifier)
.event-card {
  border: 1px solid #ccc;
  padding: 20px;

  &__title {
    font-size: 24px;
    font-weight: bold;
  }

  &__description {
    color: #666;
    margin-top: 10px;
  }

  &__button {
    background-color: #007bff;
    color: white;

    &--disabled {
      background-color: #ccc;
      cursor: not-allowed;
    }
  }
}

// ❌ Avoid (unclear structure)
.event {
  border: 1px solid #ccc;
}

.event h2 {
  font-size: 24px;
}

.event-btn {
  background-color: #007bff;
}

.event-btn.disabled {
  background-color: #ccc;
}
```

### SCSS Organization

```scss
// 1. Variables
$primary-color: #007bff;
$border-radius: 4px;
$spacing-unit: 8px;

// 2. Mixins
@mixin flex-center {
  display: flex;
  justify-content: center;
  align-items: center;
}

// 3. Base styles
body {
  font-family: Arial, sans-serif;
  background-color: #f5f5f5;
}

// 4. Component styles
.event-list {
  @include flex-center;
  gap: $spacing-unit * 2;

  .event-item {
    background: white;
    border-radius: $border-radius;
    padding: $spacing-unit * 3;
  }
}
```

---

## Comments & Documentation

### Comment Style

```typescript
// ✅ Good: Explain WHY, not WHAT

// Cache events for 5 minutes to reduce API calls
private eventCache: Map<number, Event[]> = new Map();

// Users can only register after event is created (endDate > now)
// to prevent registration for already-started events
private canRegister(event: Event): boolean {
  return event.startDate > new Date();
}

// ❌ Avoid: Obvious comments

// Create the event
const event = new Event();

// Set the title
event.title = 'Workshop';

// This function validates
function validate() { }
```

### JSDoc Style

```typescript
// ✅ Good: Full JSDoc

/**
 * Register a member for an event.
 * 
 * Only allows registration if:
 * - Event hasn't started yet
 * - Event has available capacity
 * - Member not already registered
 *
 * @param eventId - ID of event to register for
 * @param memberId - ID of member registering
 * @returns Promise resolving to Registration object
 * @throws BadRequestException if validation fails
 */
async registerForEvent(eventId: number, memberId: number): Promise<Registration> {
  // Implementation
}

// ❌ Avoid: No documentation

async registerForEvent(eventId, memberId) {
  // Implementation
}
```

---

## Error Handling

```typescript
// ✅ Good: Clear error messages

throw new BadRequestException(
  'Cannot register for event: event capacity is full (100/100 registered)'
);

// ✅ Good: Custom error classes

class EventNotFoundException extends NotFoundException {
  constructor(eventId: number) {
    super(`Event with ID ${eventId} not found`);
  }
}

// ❌ Avoid: Vague errors

throw new Error('Error');
throw new BadRequestException('Invalid data');
```

---

## Logging

```typescript
// ✅ Good: Structured logging

this.logger.log(`Event created: ${event.id} - ${event.title}`, 'EventsService');
this.logger.error(`Failed to create event: ${error.message}`, error.stack, 'EventsService');

// ✅ Good: Use logger service

@Injectable()
export class MyService {
  private logger = new Logger(MyService.name);

  doSomething() {
    this.logger.log('Action performed');
    this.logger.warn('Warning message');
    this.logger.error('Error occurred');
  }
}

// ❌ Avoid: console.log in production code

console.log('User logged in');
console.error('Error occurred');
```

---

## Testing Code Style

```typescript
// ✅ Good test organization

describe('EventsService', () => {
  let service: EventsService;
  let repository: Repository<Event>;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [EventsService, EventRepository],
    }).compile();
    service = module.get(EventsService);
    repository = module.get(EventRepository);
  });

  describe('create', () => {
    it('should create event with valid data', async () => {
      // Arrange
      const createDto = { title: 'Test', capacity: 50 };
      jest.spyOn(repository, 'save').mockResolvedValue({ id: 1, ...createDto });

      // Act
      const result = await service.create(createDto);

      // Assert
      expect(result.id).toBe(1);
      expect(repository.save).toHaveBeenCalledWith(expect.objectContaining(createDto));
    });

    it('should throw error when capacity is 0', async () => {
      const createDto = { title: 'Test', capacity: 0 };
      await expect(service.create(createDto)).rejects.toThrow();
    });
  });
});
```

---

## Code Formatting

### Auto-Formatting

Project uses Prettier. Run before commit:

```bash
npm run format  # Format all files
npm run format -- path/to/file  # Format specific file
npm run lint  # Check linting
```

### Prettier Config

Files follow `.prettierrc` config:
- 2-space indentation
- Single quotes for strings
- Semicolons required
- Print width: 100 characters

---

## Import Organization

```typescript
// ✅ Good order

// 1. External library imports
import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

// 2. RxJS imports
import { Observable } from 'rxjs';
import { map, filter } from 'rxjs/operators';

// 3. Local service imports
import { UserService } from '../services/user.service';
import { AuthService } from '../services/auth.service';

// 4. Local model imports
import { User } from '../models/user.model';
import { Event } from '../models/event.model';

// ❌ Avoid: Random order
import { UserService } from '../services/user.service';
import { Observable } from 'rxjs';
import { Component } from '@angular/core';
import { User } from '../models/user.model';
```

---

## Related Documentation

- [Contributing Guide](./17-Contributing.md)
- [Architecture Overview](./09-Architecture.md)
- [ADRs](./12-ADRs.md)

---

**Note**: Code reviews enforce these standards. Questions? Ask during PR review.
