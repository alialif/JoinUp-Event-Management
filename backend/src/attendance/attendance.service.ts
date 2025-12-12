import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Attendance } from '../entities/attendance.entity';
import { Member } from '../entities/member.entity';
import { Event } from '../entities/event.entity';
import { AuditService } from '../audit/audit.service';

@Injectable()
export class AttendanceService {
  constructor(
    @InjectRepository(Attendance) private repo: Repository<Attendance>,
    @InjectRepository(Member) private memberRepo: Repository<Member>,
    @InjectRepository(Event) private eventRepo: Repository<Event>,
    private auditService: AuditService
  ) {}

  async mark(memberId: string, eventId: string, actorId: string): Promise<Attendance> {
    const member = await this.memberRepo.findOne({ where: { id: memberId } });
    if (!member) throw new BadRequestException('Member not found');
    const event = await this.eventRepo.findOne({ where: { id: eventId } });
    if (!event) throw new BadRequestException('Event not found');

    const existing = await this.repo.findOne({ where: { member: { id: memberId }, event: { id: eventId } } });
    if (existing) return existing;

    const attendance = this.repo.create({ member, event });
    const saved = await this.repo.save(attendance);

    await this.auditService.log(actorId, 'attendance.mark', 'Attendance', saved.id);
    return saved;
  }

  async listForEvent(eventId: string): Promise<Attendance[]> {
    return this.repo.find({ where: { event: { id: eventId } }, order: { attendedAt: 'ASC' } });
  }
}
