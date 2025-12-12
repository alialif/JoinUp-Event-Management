import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Event } from '../entities/event.entity';

@Injectable()
export class EventsService {
  constructor(@InjectRepository(Event) private repo: Repository<Event>) {}

  async create(data: Partial<Event>): Promise<Event> {
    const event = this.repo.create(data);
    return this.repo.save(event);
  }

  async findAll(): Promise<Event[]> {
    return this.repo.find({ order: { startDate: 'ASC' } });
  }

  async findOne(id: string): Promise<Event> {
    const event = await this.repo.findOne({ where: { id } });
    if (!event) throw new NotFoundException('Event not found');
    return event;
  }

  async update(id: string, data: Partial<Event>): Promise<Event> {
    const event = await this.findOne(id);
    Object.assign(event, data);
    return this.repo.save(event);
  }

  async remove(id: string): Promise<void> {
    const event = await this.findOne(id);
    await this.repo.remove(event);
  }

  async assertCapacity(eventId: string): Promise<void> {
    const event = await this.findOne(eventId);
    const count = event.registrations?.length ?? 0;
    if (count >= event.maxRegistrations) {
      throw new BadRequestException('Event registration capacity reached');
    }
  }
}
