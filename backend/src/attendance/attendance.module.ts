import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Attendance } from '../entities/attendance.entity';
import { Member } from '../entities/member.entity';
import { Event } from '../entities/event.entity';
import { AttendanceService } from './attendance.service';
import { AttendanceController } from './attendance.controller';
import { AuditModule } from '../audit/audit.module';

@Module({
  imports: [TypeOrmModule.forFeature([Attendance, Member, Event]), AuditModule],
  providers: [AttendanceService],
  controllers: [AttendanceController]
})
export class AttendanceModule {}
