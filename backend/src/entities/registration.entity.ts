import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, Index } from 'typeorm';
import { Member } from './member.entity';
import { Event } from './event.entity';

@Entity()
@Index(['event', 'sequentialCode'], { unique: true })
export class Registration {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @ManyToOne(() => Member, m => m.registrations, { eager: true })
  member!: Member;

  @ManyToOne(() => Event, e => e.registrations, { eager: true })
  event!: Event;

  @Column({ type: 'int' })
  sequentialCode!: number; // 1..N within event

  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  createdAt!: Date;
}
