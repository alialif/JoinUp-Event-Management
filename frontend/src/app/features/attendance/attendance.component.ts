import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from '../../core/api.service';
import { TranslateModule } from '@ngx-translate/core';

interface RegistrationView {
  id: string;
  memberName: string;
  attended: boolean;
  memberId: string;
}

@Component({
  selector: 'app-attendance',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  template: `
    <h2>{{ 'attendance.title' | translate }}</h2>
    <div *ngIf="loading()">{{ 'common.loading' | translate }}</div>
    <div class="error" *ngIf="error()">{{ error() }}</div>
    <table *ngIf="!loading() && registrations().length > 0" class="att-table">
      <thead>
        <tr>
          <th>{{ 'registrations.registrationCode' | translate }}</th>
          <th>{{ 'auth.email' | translate }}</th>
          <th>{{ 'attendance.markAttendance' | translate }}</th>
        </tr>
      </thead>
      <tbody>
        <tr *ngFor="let r of registrations()">
          <td>{{ r.id }}</td>
          <td>{{ r.memberName }}</td>
          <td>
            <button (click)="mark(r)" [disabled]="r.attended">{{ r.attended ? ('events.alreadyRegistered' | translate) : ('attendance.markAttendance' | translate) }}</button>
          </td>
        </tr>
      </tbody>
    </table>
    <div *ngIf="!loading() && registrations().length === 0">{{ 'registrations.noRegistrations' | translate }}</div>
  `,
  styles: [`
    .att-table { width:100%; border-collapse: collapse; background:#fff; }
    .att-table th, .att-table td { padding:0.4rem 0.6rem; border:1px solid #ddd; font-size:0.75rem; }
    .error { color:#d9534f; margin:0.5rem 0; }
    button { padding:0.3rem 0.6rem; font-size:0.7rem; }
  `]
})
export class AttendanceComponent {
  private route = inject(ActivatedRoute);
  private api = inject(ApiService);

  loading = signal(true);
  error = signal<string | null>(null);
  registrations = signal<RegistrationView[]>([]);
  eventId: string = '';

  constructor() {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) {
      this.error.set('Invalid event id');
      this.loading.set(false);
      return;
    }
    this.eventId = id;
    this.api.getEventRegistrations(id).subscribe({
      next: regs => {
        this.api.getEventAttendance(id).subscribe({
          next: attendance => {
            const attMap = new Set(attendance.map(a => String(a.member.id)));
            const list: RegistrationView[] = regs.map(r => ({
              id: r.id,
              memberName: r.member.email,
              attended: attMap.has(String(r.member.id)),
              memberId: String(r.member.id)
            }));
            this.registrations.set(list);
            this.loading.set(false);
          },
          error: () => {
            // fallback no attendance yet
            const list: RegistrationView[] = regs.map(r => ({
              id: r.id,
              memberName: r.member.email,
              attended: false,
              memberId: String(r.member.id)
            }));
            this.registrations.set(list);
            this.loading.set(false);
          }
        });
      },
      error: err => {
        this.error.set(err?.error?.message || 'Failed to load registrations');
        this.loading.set(false);
      }
    });
  }

  mark(r: RegistrationView) {
    if (r.attended) return;
    this.api.markAttendance(this.eventId, r.memberId).subscribe({
      next: () => {
        r.attended = true;
        this.registrations.set([...this.registrations()]);
      },
      error: err => this.error.set(err?.error?.message || 'Failed to mark attendance')
    });
  }
}
