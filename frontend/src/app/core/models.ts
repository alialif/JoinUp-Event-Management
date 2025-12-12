export interface Member {
  id: string;
  email: string;
  name: string;
  employeeId?: string;
  role: 'admin' | 'staff' | 'participant';
}

export interface Event {
  id: string;
  title: string;
  description?: string;
  startDate: Date;
  endDate: Date;
  maxRegistrations: number;
}

export interface Registration {
  id: string;
  member: Member;
  event: Event;
  sequentialCode: number;
  createdAt: Date;
}

export interface Attendance {
  id: string;
  member: Member;
  event: Event;
  attendedAt: Date;
}

export interface Certificate {
  id: string;
  registration: Registration;
  filePath: string;
  pdfUrl?: string;
  issuedAt: Date;
}

export interface AuditLog {
  id: string;
  actorId: string;
  action: string;
  entityType?: string;
  entityId?: string;
  createdAt: Date;
}
