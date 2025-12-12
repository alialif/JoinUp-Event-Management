import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Event, Registration, Attendance, Certificate } from './models';

@Injectable({ providedIn: 'root' })
export class ApiService {
  private http = inject(HttpClient);
  private baseUrl = 'http://localhost:3000';

  // Events
  getEvents(): Observable<Event[]> {
    return this.http.get<Event[]>(`${this.baseUrl}/events`);
  }

  getEvent(id: string): Observable<Event> {
    return this.http.get<Event>(`${this.baseUrl}/events/${id}`);
  }

  createEvent(event: Partial<Event>): Observable<Event> {
    return this.http.post<Event>(`${this.baseUrl}/events`, event);
  }

  // Registrations
  register(eventId: string, memberId: string): Observable<Registration> {
    return this.http.post<Registration>(`${this.baseUrl}/registrations/${eventId}/member/${memberId}`, {});
  }

  getEventRegistrations(eventId: string): Observable<Registration[]> {
    return this.http.get<Registration[]>(`${this.baseUrl}/registrations/event/${eventId}`);
  }

  // Attendance
  markAttendance(eventId: string, memberId: string): Observable<Attendance> {
    return this.http.post<Attendance>(`${this.baseUrl}/attendance/mark/${eventId}/member/${memberId}`, {});
  }

  getEventAttendance(eventId: string): Observable<Attendance[]> {
    return this.http.get<Attendance[]>(`${this.baseUrl}/attendance/event/${eventId}`);
  }

  // Certificates
  issueCertificate(registrationId: string): Observable<Certificate> {
    return this.http.post<Certificate>(`${this.baseUrl}/certificates/issue/${registrationId}`, {});
  }

  verifyCertificate(registrationId: string, code: number): Observable<{ valid: boolean }> {
    return this.http.get<{ valid: boolean }>(`${this.baseUrl}/certificates/verify/${registrationId}?code=${code}`);
  }

  // Members
  getAllMembers(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/auth/members`);
  }

  promoteToStaff(memberId: string): Observable<any> {
    return this.http.put(`${this.baseUrl}/auth/promote/${memberId}`, {});
  }

  changeUserRole(memberId: string, role: string): Observable<any> {
    return this.http.put(`${this.baseUrl}/auth/members/${memberId}/role`, { role });
  }
}
