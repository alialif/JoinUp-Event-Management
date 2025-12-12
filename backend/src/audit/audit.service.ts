import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AuditLog } from '../entities/audit-log.entity';

@Injectable()
export class AuditService {
  constructor(@InjectRepository(AuditLog) private repo: Repository<AuditLog>) {}

  async log(actorId: string, action: string, entityType?: string, entityId?: string): Promise<AuditLog> {
    const entry = this.repo.create({ actorId, action, entityType, entityId });
    return this.repo.save(entry);
  }

  async findAll(limit = 100): Promise<AuditLog[]> {
    return this.repo.find({ order: { createdAt: 'DESC' }, take: limit });
  }
}
