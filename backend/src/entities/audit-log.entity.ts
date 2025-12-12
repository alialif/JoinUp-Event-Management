import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class AuditLog {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  actorId!: string;

  @Column({ type: 'text' })
  action!: string; // e.g. registration.create, attendance.mark, certificate.issue

  @Column({ type: 'text', nullable: true })
  entityType?: string;

  @Column({ type: 'text', nullable: true })
  entityId?: string;

  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  createdAt!: Date;
}
