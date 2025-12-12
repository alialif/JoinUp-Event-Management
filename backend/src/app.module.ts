import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Member } from './entities/member.entity';
import { Event } from './entities/event.entity';
import { Registration } from './entities/registration.entity';
import { Attendance } from './entities/attendance.entity';
import { Certificate } from './entities/certificate.entity';
import { AuditLog } from './entities/audit-log.entity';
import { AuthModule } from './auth/auth.module';
import { EventsModule } from './events/events.module';
import { RegistrationsModule } from './registrations/registrations.module';
import { AttendanceModule } from './attendance/attendance.module';
import { CertificatesModule } from './certificates/certificates.module';
import { AuditModule } from './audit/audit.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'data.sqlite',
      entities: [Member, Event, Registration, Attendance, Certificate, AuditLog],
      synchronize: true,
    }),
    AuthModule,
    EventsModule,
    RegistrationsModule,
    AttendanceModule,
    CertificatesModule,
    AuditModule,
  ],
})
export class AppModule {}
