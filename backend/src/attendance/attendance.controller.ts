import { Controller, Post, Param, Get, UseGuards, Req } from '@nestjs/common';
import { AttendanceService } from './attendance.service';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';

@ApiTags('attendance')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller('attendance')
export class AttendanceController {
  constructor(private service: AttendanceService) {}

  @Post('mark/:eventId/member/:memberId')
  @ApiOperation({ summary: 'Mark member attendance for an event' })
  @ApiResponse({
    status: 201,
    description: 'Attendance successfully marked',
    schema: {
      example: {
        id: '623e4567-e89b-12d3-a456-426614174005',
        registration: {
          id: '523e4567-e89b-12d3-a456-426614174004',
          member: {
            id: '123e4567-e89b-12d3-a456-426614174000',
            name: 'John Doe',
          },
          event: {
            id: '323e4567-e89b-12d3-a456-426614174002',
            title: 'Angular Workshop 2025',
          },
        },
        markedAt: '2025-02-15T09:15:00.000Z',
        markedBy: {
          id: '223e4567-e89b-12d3-a456-426614174001',
          name: 'Staff User',
        },
      },
    },
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Registration not found' })
  async mark(@Param('memberId') memberId: string, @Param('eventId') eventId: string, @Req() req: any) {
    return this.service.mark(memberId, eventId, req.user.userId);
  }

  @Get('event/:eventId')
  @ApiOperation({ summary: 'Get all attendance records for an event' })
  @ApiResponse({
    status: 200,
    description: 'List of attendance records',
    schema: {
      example: [
        {
          id: '623e4567-e89b-12d3-a456-426614174005',
          registration: {
            member: {
              id: '123e4567-e89b-12d3-a456-426614174000',
              name: 'John Doe',
              email: 'john.doe@example.com',
            },
          },
          markedAt: '2025-02-15T09:15:00.000Z',
          markedBy: {
            name: 'Staff User',
          },
        },
      ],
    },
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Event not found' })
  list(@Param('eventId') eventId: string) {
    return this.service.listForEvent(eventId);
  }
}
