import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Registration } from './registration.entity';

@Entity()
export class Certificate {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @ManyToOne(() => Registration, { eager: true })
  registration!: Registration;

  @Column({ type: 'text' })
  filePath!: string; // stored PDF path

  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  issuedAt!: Date;
}
