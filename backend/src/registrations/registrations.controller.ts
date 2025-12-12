import { Controller, Post, Param, Get } from '@nestjs/common';
import { RegistrationsService } from './registrations.service';
import { Registration } from '../entities/registration.entity';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('registrations')
@ApiBearerAuth()
@Controller('registrations')
export class RegistrationsController {
  constructor(private readonly service: RegistrationsService) {}

  @Post(':eventId/member/:memberId')
  register(@Param('memberId') memberId: string, @Param('eventId') eventId: string): Promise<Registration> {
    return this.service.register(memberId, eventId);
  }

  @Get('event/:eventId')
  list(@Param('eventId') eventId: string): Promise<Registration[]> {
    return this.service.listForEvent(eventId);
  }
}
