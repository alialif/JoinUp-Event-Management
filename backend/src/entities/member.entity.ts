import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Registration } from './registration.entity';

export enum MemberRole {
  ADMIN = 'admin',
  STAFF = 'staff',
  PARTICIPANT = 'participant'
}

export enum Gender {
  MALE = 'male',
  FEMALE = 'female',
  OTHER = 'other',
  PREFER_NOT_TO_SAY = 'prefer_not_to_say'
}

@Entity()
export class Member {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ unique: true })
  email!: string;

  @Column()
  name!: string;

  @Column({ nullable: true })
  employeeId?: string;

  @Column({ type: 'date', nullable: true })
  birthDate?: Date;

  @Column({ type: 'text', nullable: true })
  gender?: string;

  @Column({ type: 'text' })
  passwordHash!: string;

  @Column({ type: 'text', default: MemberRole.PARTICIPANT })
  role!: MemberRole;

  @OneToMany(() => Registration, r => r.member)
  registrations!: Registration[];
}
