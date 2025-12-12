import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Registration } from './registration.entity';
import { Attendance } from './attendance.entity';

@Entity()
export class Event {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  title!: string;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @Column({ type: 'datetime' })
  startDate!: Date;

  @Column({ type: 'datetime' })
  endDate!: Date;

  @Column({ type: 'int', default: 50 })
  maxRegistrations!: number;

  @Column({ type: 'simple-array', nullable: true })
  categories?: string[];

  @Column({ type: 'text', default: 'free' })
  price!: string;

  @OneToMany(() => Registration, r => r.event)
  registrations!: Registration[];

  @OneToMany(() => Attendance, a => a.event)
  attendanceRecords!: Attendance[];
}
