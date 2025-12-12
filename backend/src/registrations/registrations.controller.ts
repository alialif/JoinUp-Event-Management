import { Controller, Post, Param, Get } from '@nestjs/common';
import { RegistrationsService } from './registrations.service';
import { Registration } from '../entities/registration.entity';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('registrations')
@ApiBearerAuth()
@Controller('registrations')
export class RegistrationsController {
  constructor(private readonly service: RegistrationsService) {}

  @Post(':eventId/member/:memberId')
  @ApiOperation({ summary: 'Register a member for an event' })
  @ApiResponse({
    status: 201,
    description: 'Member successfully registered for the event',
    schema: {
      example: {
        id: '523e4567-e89b-12d3-a456-426614174004',
        event: {
          id: '323e4567-e89b-12d3-a456-426614174002',
          title: 'Angular Workshop 2025',
        },
        member: {
          id: '123e4567-e89b-12d3-a456-426614174000',
          name: 'John Doe',
          email: 'john.doe@example.com',
        },
        registeredAt: '2025-01-15T10:30:00.000Z',
      },
    },
  })
  @ApiResponse({ status: 400, description: 'Member already registered or event is full' })
  @ApiResponse({ status: 404, description: 'Member or event not found' })
  register(@Param('memberId') memberId: string, @Param('eventId') eventId: string): Promise<Registration> {
    return this.service.register(memberId, eventId);
  }

  @Get('event/:eventId')
  @ApiOperation({ summary: 'Get all registrations for an event' })
  @ApiResponse({
    status: 200,
    description: 'List of registrations',
    schema: {
      example: [
        {
          id: '523e4567-e89b-12d3-a456-426614174004',
          member: {
            id: '123e4567-e89b-12d3-a456-426614174000',
            name: 'John Doe',
            email: 'john.doe@example.com',
          },
          registeredAt: '2025-01-15T10:30:00.000Z',
        },
      ],
    },
  })
  @ApiResponse({ status: 404, description: 'Event not found' })
  list(@Param('eventId') eventId: string): Promise<Registration[]> {
    return this.service.listForEvent(eventId);
  }
}
