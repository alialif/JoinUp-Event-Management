import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Registration } from '../entities/registration.entity';
import { Event } from '../entities/event.entity';
import { Member } from '../entities/member.entity';

@Injectable()
export class RegistrationsService {
  constructor(
    @InjectRepository(Registration) private regRepo: Repository<Registration>,
    @InjectRepository(Event) private eventRepo: Repository<Event>,
    @InjectRepository(Member) private memberRepo: Repository<Member>
  ) {}

  async register(memberId: string, eventId: string): Promise<Registration> {
    const event = await this.eventRepo.findOne({ where: { id: eventId }, relations: ['registrations'] });
    if (!event) throw new BadRequestException('Event not found');
    const member = await this.memberRepo.findOne({ where: { id: memberId } });
    if (!member) throw new BadRequestException('Member not found');

    const existing = await this.regRepo.findOne({ where: { event: { id: eventId }, member: { id: memberId } } });
    if (existing) throw new BadRequestException('Already registered');

    const currentCount = event.registrations?.length ?? 0;
    if (currentCount >= event.maxRegistrations) throw new BadRequestException('Event capacity reached');

    // sequential code is next number
    const sequentialCode = currentCount + 1;
    const reg = this.regRepo.create({ event, member, sequentialCode });
    return this.regRepo.save(reg);
  }

  async listForEvent(eventId: string): Promise<Registration[]> {
    return this.regRepo.find({ where: { event: { id: eventId } }, order: { sequentialCode: 'ASC' } });
  }

  async findOne(id: string): Promise<Registration | null> {
    return this.regRepo.findOne({ where: { id } });
  }
}
