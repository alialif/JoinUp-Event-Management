import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Certificate } from '../entities/certificate.entity';
import { Registration } from '../entities/registration.entity';
import { CertificatesService } from './certificates.service';
import { CertificatesController } from './certificates.controller';
import { AuditModule } from '../audit/audit.module';

@Module({
  imports: [TypeOrmModule.forFeature([Certificate, Registration]), AuditModule],
  providers: [CertificatesService],
  controllers: [CertificatesController]
})
export class CertificatesModule {}
