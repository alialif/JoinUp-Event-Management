import { Controller, Get, UseGuards, Query } from '@nestjs/common';
import { AuditService } from './audit.service';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { MemberRole } from '../entities/member.entity';

@ApiTags('audit')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'), RolesGuard)
@Controller('audit')
export class AuditController {
  constructor(private service: AuditService) {}

  @Get()
  @Roles(MemberRole.ADMIN, MemberRole.STAFF)
  @ApiOperation({ summary: 'Get audit logs (admin/staff only)' })
  @ApiQuery({ name: 'limit', required: false, description: 'Maximum number of logs to return', example: 100 })
  @ApiResponse({
    status: 200,
    description: 'List of audit logs',
    schema: {
      example: [
        {
          id: '823e4567-e89b-12d3-a456-426614174007',
          action: 'MEMBER_REGISTERED',
          memberId: '123e4567-e89b-12d3-a456-426614174000',
          memberName: 'John Doe',
          details: 'Member registered for event: Angular Workshop 2025',
          timestamp: '2025-01-15T10:30:00.000Z',
        },
        {
          id: '923e4567-e89b-12d3-a456-426614174008',
          action: 'ATTENDANCE_MARKED',
          memberId: '223e4567-e89b-12d3-a456-426614174001',
          memberName: 'Staff User',
          details: 'Marked attendance for John Doe at Angular Workshop 2025',
          timestamp: '2025-02-15T09:15:00.000Z',
        },
      ],
    },
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Admin or Staff role required' })
  findAll(@Query('limit') limit?: string) {
    return this.service.findAll(limit ? parseInt(limit) : 100);
  }
}
