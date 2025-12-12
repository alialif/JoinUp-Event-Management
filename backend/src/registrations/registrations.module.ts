import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Registration } from '../entities/registration.entity';
import { Event } from '../entities/event.entity';
import { Member } from '../entities/member.entity';
import { RegistrationsService } from './registrations.service';
import { RegistrationsController } from './registrations.controller';
import { EventsService } from '../events/events.service';

@Module({
  imports: [TypeOrmModule.forFeature([Registration, Event, Member])],
  providers: [RegistrationsService, EventsService],
  controllers: [RegistrationsController]
})
export class RegistrationsModule {}
