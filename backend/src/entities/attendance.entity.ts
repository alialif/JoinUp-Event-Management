import { Entity, PrimaryGeneratedColumn, ManyToOne, Column, Unique } from 'typeorm';
import { Member } from './member.entity';
import { Event } from './event.entity';

@Entity()
@Unique(['member', 'event'])
export class Attendance {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @ManyToOne(() => Member, { eager: true })
  member!: Member;

  @ManyToOne(() => Event, { eager: true })
  event!: Event;

  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  attendedAt!: Date;
}
