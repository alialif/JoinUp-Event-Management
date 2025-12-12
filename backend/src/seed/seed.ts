import { DataSource } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Member, MemberRole } from '../entities/member.entity';
import { Event } from '../entities/event.entity';
import { Registration } from '../entities/registration.entity';
import { Attendance } from '../entities/attendance.entity';
import { Certificate } from '../entities/certificate.entity';
import { AuditLog } from '../entities/audit-log.entity';

async function seed() {
  const dataSource = new DataSource({
    type: 'sqlite',
    database: 'data.sqlite',
    entities: [Member, Event, Registration, Attendance, Certificate, AuditLog],
    synchronize: true
  });

  await dataSource.initialize();

  const memberRepo = dataSource.getRepository(Member);
  const eventRepo = dataSource.getRepository(Event);
  const registrationRepo = dataSource.getRepository(Registration);
  const attendanceRepo = dataSource.getRepository(Attendance);
  const certificateRepo = dataSource.getRepository(Certificate);
  const auditLogRepo = dataSource.getRepository(AuditLog);

  // Clear existing data
  console.log('🧹 Clearing existing data...');
  await certificateRepo.clear();
  await attendanceRepo.clear();
  await registrationRepo.clear();
  await auditLogRepo.clear();
  await eventRepo.clear();
  await memberRepo.clear();
  console.log('✅ Existing data cleared');

  // Create admin
  const adminHash = await bcrypt.hash('admin123', 10);
  const admin = memberRepo.create({
    email: 'admin@bootcamp.com',
    name: 'Admin User',
    passwordHash: adminHash,
    role: MemberRole.ADMIN,
    employeeId: 'EMP001',
    birthDate: new Date('1985-05-15')
  });
  await memberRepo.save(admin);

  // Create staff
  const staffHash = await bcrypt.hash('staff123', 10);
  const staff = memberRepo.create({
    email: 'staff@bootcamp.com',
    name: 'Staff Member',
    passwordHash: staffHash,
    role: MemberRole.STAFF,
    employeeId: 'EMP002',
    birthDate: new Date('1990-08-20')
  });
  await memberRepo.save(staff);

  // Create sample participants
  for (let i = 1; i <= 5; i++) {
    const participantHash = await bcrypt.hash('participant123', 10);
    const participant = memberRepo.create({
      email: `participant${i}@bootcamp.com`,
      name: `Participant ${i}`,
      passwordHash: participantHash,
      role: MemberRole.PARTICIPANT,
      employeeId: `EMP00${i + 2}`,
      birthDate: new Date(1990 + i, i, 15)
    });
    await memberRepo.save(participant);
  }

  // Create sample events
  const event1 = eventRepo.create({
    title: 'AI Bootcamp 2025',
    description: 'Advanced AI and Machine Learning bootcamp for professionals',
    startDate: new Date('2025-11-10'),
    endDate: new Date('2025-11-14'),
    maxRegistrations: 50
  });
  await eventRepo.save(event1);

  const event2 = eventRepo.create({
    title: 'Game Awards 2025',
    description: 'Annual awards ceremony for the best in gaming',
    startDate: new Date('2025-12-11'),
    endDate: new Date('2025-12-11'),
    maxRegistrations: 50
  });
  await eventRepo.save(event2);

  console.log('✅ Seed completed: admin, staff, 5 participants, 2 events');
  await dataSource.destroy();
}

seed().catch(console.error);
