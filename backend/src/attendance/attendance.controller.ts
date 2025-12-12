import { Controller, Post, Param, Get, UseGuards, Req } from '@nestjs/common';
import { AttendanceService } from './attendance.service';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';

@ApiTags('attendance')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller('attendance')
export class AttendanceController {
  constructor(private service: AttendanceService) {}

  @Post('mark/:eventId/member/:memberId')
  async mark(@Param('memberId') memberId: string, @Param('eventId') eventId: string, @Req() req: any) {
    return this.service.mark(memberId, eventId, req.user.userId);
  }

  @Get('event/:eventId')
  list(@Param('eventId') eventId: string) {
    return this.service.listForEvent(eventId);
  }
}
