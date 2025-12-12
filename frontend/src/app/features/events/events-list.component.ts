import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../core/api.service';
import { TranslateModule } from '@ngx-translate/core';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../core/auth.service';
import { HasRoleDirective } from '../../core/has-role.directive';

interface EventWithCapacity {
  id: string;
  title: string;
  description?: string;
  startDate: string;
  endDate: string;
  maxRegistrations: number;
  registrationsCount: number;
  userRegistrationId?: string;
}

@Component({
  selector: 'app-events-list',
  standalone: true,
  imports: [CommonModule, TranslateModule, RouterModule, HasRoleDirective],
  template: `
    <div class="header">
      <h2>{{ 'events.title' | translate }}</h2>
      <a *hasRole="['admin','staff']" [routerLink]="['/events/create']" class="create-btn">{{ 'events.createEvent' | translate }}</a>
    </div>
    <div *ngIf="loading()">{{ 'common.loading' | translate }}</div>
    <div class="error" *ngIf="error()">{{ error() }}</div>
    <div *ngIf="!loading() && events().length === 0">{{ 'events.empty' | translate }}</div>
    <table *ngIf="events().length > 0" class="events-table">
      <thead>
        <tr>
          <th>{{ 'events.eventTitle' | translate }}</th>
          <th>{{ 'events.startDate' | translate }}</th>
          <th>{{ 'events.endDate' | translate }}</th>
          <th>{{ 'events.capacity' | translate }}</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        <tr *ngFor="let ev of events()">
          <td>{{ ev.title }}</td>
          <td>{{ ev.startDate | date:'yyyy-MM-dd' }}</td>
          <td>{{ ev.endDate | date:'yyyy-MM-dd' }}</td>
          <td>{{ ev.registrationsCount }}/{{ ev.maxRegistrations }}</td>
          <td>
            <a [routerLink]="['/events', ev.id]" class="link">{{ 'events.view' | translate }}</a>
            <button *ngIf="canShowRegisterButton(ev)"
                    class="register-btn"
                    (click)="register(ev)"
                    [disabled]="!canRegister(ev)">
              {{ 'events.register' | translate }}
            </button>
            <button *ngIf="canShowCertificate(ev)"
                    class="certificate-btn"
                    (click)="downloadCertificate(ev)">
              {{ 'certificates.title' | translate }}
            </button>
          </td>
        </tr>
      </tbody>
    </table>
  `,
  styles: [`
    .header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem; }
    .create-btn { padding: 0.5rem 1rem; background: #0066cc; color: #fff; text-decoration: none; border-radius: 4px; font-size: 0.85rem; }
    .events-table { width:100%; border-collapse: collapse; background:#fff; }
    .events-table th, .events-table td { padding:0.5rem 0.75rem; border:1px solid #ddd; font-size:0.85rem; }
    .register-btn { margin-left:0.5rem; padding:0.35rem 0.6rem; font-size:0.75rem; background:#c00; color:#fff; border:none; border-radius:4px; cursor:pointer; }
    .register-btn:disabled { opacity:0.4; cursor:not-allowed; }
    .certificate-btn { margin-left:0.5rem; padding:0.35rem 0.6rem; font-size:0.75rem; background:#28a745; color:#fff; border:none; border-radius:4px; cursor:pointer; }
    .error { color:#d9534f; margin-bottom:0.75rem; }
    .link { margin-right: 0.5rem; }
  `]
})
export class EventsListComponent {
  private api = inject(ApiService);
  private auth = inject(AuthService);
  loading = signal(true);
  error = signal<string | null>(null);
  events = signal<EventWithCapacity[]>([]);
  userRegistrations = signal<Map<string, string>>(new Map());

  constructor() {
    this.api.getEvents().subscribe({
      next: events => {
        const user = this.auth.currentUserValue;
        // For each event, fetch registrations list to compute count
        const pending: Promise<EventWithCapacity>[] = events.map(ev => new Promise(resolve => {
          this.api.getEventRegistrations(String(ev.id)).subscribe({
            next: regs => {
              const userReg = user ? regs.find(r => String(r.member.id) === String(user.id)) : undefined;
              if (userReg) {
                this.userRegistrations().set(String(ev.id), String(userReg.id));
              }
              resolve({
                id: String(ev.id),
                title: ev.title,
                description: ev.description,
                startDate: String(ev.startDate),
                endDate: String(ev.endDate),
                maxRegistrations: ev.maxRegistrations,
                registrationsCount: regs.length,
                userRegistrationId: userReg ? String(userReg.id) : undefined
              });
            },
            error: () => resolve({
              id: String(ev.id),
              title: ev.title,
              description: ev.description,
              startDate: String(ev.startDate),
              endDate: String(ev.endDate),
              maxRegistrations: ev.maxRegistrations,
              registrationsCount: 0
            })
          });
        }));
        Promise.all(pending).then(full => {
          this.events.set(full);
          this.loading.set(false);
        });
      },
      error: err => {
        this.error.set(err?.error?.message || 'Failed to load events');
        this.loading.set(false);
      }
    });
  }

  register(ev: EventWithCapacity) {
    if (ev.registrationsCount >= ev.maxRegistrations) return;
    const user = this.auth.currentUserValue;
    if (!user) {
      this.error.set('Please login first');
      return;
    }
    this.api.register(String(ev.id), String(user.id)).subscribe({
      next: (reg) => {
        ev.registrationsCount += 1;
        ev.userRegistrationId = String(reg.id);
        this.userRegistrations().set(String(ev.id), String(reg.id));
        this.events.set([...this.events()]);
      },
      error: err => this.error.set(err?.error?.message || 'Registration failed')
    });
  }

  canRegister(ev: EventWithCapacity): boolean {
    const user = this.auth.currentUserValue;
    if (!user || ev.userRegistrationId) return false;

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const startDate = new Date(ev.startDate);
    startDate.setHours(0, 0, 0, 0);

    return startDate > today && ev.registrationsCount < ev.maxRegistrations;
  }

  canShowRegisterButton(ev: EventWithCapacity): boolean {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const endDate = new Date(ev.endDate);
    endDate.setHours(0, 0, 0, 0);

    return endDate >= today;
  }

  canShowCertificate(ev: EventWithCapacity): boolean {
    const user = this.auth.currentUserValue;
    if (!user || !ev.userRegistrationId) return false;

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const endDate = new Date(ev.endDate);
    endDate.setHours(0, 0, 0, 0);

    return endDate < today;
  }

  downloadCertificate(ev: EventWithCapacity) {
    if (!ev.userRegistrationId) return;

    this.api.issueCertificate(ev.userRegistrationId).subscribe({
      next: (cert) => {
        if (cert.pdfUrl) {
          window.open(cert.pdfUrl, '_blank');
        }
      },
      error: err => this.error.set(err?.error?.message || 'Failed to generate certificate')
    });
  }
}
