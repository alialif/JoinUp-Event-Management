import { Controller, Get, Post, Body, Param, Put, Delete, UseGuards } from '@nestjs/common';
import { EventsService } from './events.service';
import { Event } from '../entities/event.entity';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt.strategy';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { MemberRole } from '../entities/member.entity';
import { CreateEventDto } from './dto/create-event.dto';

@ApiTags('events')
@ApiBearerAuth()
@Controller('events')
export class EventsController {
  constructor(private readonly service: EventsService) {}

  @Get()
  @ApiOperation({ summary: 'Get all events' })
  @ApiResponse({
    status: 200,
    description: 'List of all events',
    schema: {
      example: [
        {
          id: '323e4567-e89b-12d3-a456-426614174002',
          title: 'Angular Workshop 2025',
          description: 'Learn Angular 20 with hands-on examples',
          startDate: '2025-02-15T09:00:00.000Z',
          endDate: '2025-02-15T17:00:00.000Z',
          maxRegistrations: 50,
          categories: ['workshop', 'conference'],
          price: 'free',
          registrations: [],
        },
      ],
    },
  })
  findAll(): Promise<Event[]> {
    return this.service.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get event by ID' })
  @ApiResponse({
    status: 200,
    description: 'Event details',
    schema: {
      example: {
        id: '323e4567-e89b-12d3-a456-426614174002',
        title: 'Angular Workshop 2025',
        description: 'Learn Angular 20 with hands-on examples and best practices',
        startDate: '2025-02-15T09:00:00.000Z',
        endDate: '2025-02-15T17:00:00.000Z',
        maxRegistrations: 50,
        categories: ['workshop', 'conference'],
        price: 'free',
        registrations: [
          {
            id: '423e4567-e89b-12d3-a456-426614174003',
            member: {
              id: '123e4567-e89b-12d3-a456-426614174000',
              name: 'John Doe',
              email: 'john.doe@example.com',
            },
          },
        ],
      },
    },
  })
  @ApiResponse({ status: 404, description: 'Event not found' })
  findOne(@Param('id') id: string): Promise<Event> {
    return this.service.findOne(id);
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(MemberRole.ADMIN, MemberRole.STAFF)
  @ApiOperation({ summary: 'Create a new event (admin/staff only)' })
  @ApiResponse({
    status: 201,
    description: 'Event successfully created',
    schema: {
      example: {
        id: '323e4567-e89b-12d3-a456-426614174002',
        title: 'Angular Workshop 2025',
        description: 'Learn Angular 20 with hands-on examples',
        startDate: '2025-02-15T09:00:00.000Z',
        endDate: '2025-02-15T17:00:00.000Z',
        maxRegistrations: 50,
        categories: ['workshop', 'conference'],
        price: 'free',
      },
    },
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Admin or Staff role required' })
  create(@Body() dto: CreateEventDto): Promise<Event> {
    return this.service.create(dto as any);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(MemberRole.ADMIN, MemberRole.STAFF)
  @ApiOperation({ summary: 'Update an event (admin/staff only)' })
  @ApiResponse({
    status: 200,
    description: 'Event successfully updated',
    schema: {
      example: {
        id: '323e4567-e89b-12d3-a456-426614174002',
        title: 'Angular Workshop 2025 - Updated',
        description: 'Learn Angular 20 with hands-on examples',
        startDate: '2025-02-15T09:00:00.000Z',
        endDate: '2025-02-15T17:00:00.000Z',
        maxRegistrations: 60,
        categories: ['workshop', 'conference'],
        price: 'paid',
      },
    },
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Admin or Staff role required' })
  @ApiResponse({ status: 404, description: 'Event not found' })
  update(@Param('id') id: string, @Body() dto: Partial<CreateEventDto>): Promise<Event> {
    return this.service.update(id, dto as any);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(MemberRole.ADMIN)
  @ApiOperation({ summary: 'Delete an event (admin only)' })
  @ApiResponse({ status: 200, description: 'Event successfully deleted' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Admin role required' })
  @ApiResponse({ status: 404, description: 'Event not found' })
  remove(@Param('id') id: string): Promise<void> {
    return this.service.remove(id);
  }
}
