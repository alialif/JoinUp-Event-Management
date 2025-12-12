import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { ApiService } from '../../core/api.service';
import { TranslateModule } from '@ngx-translate/core';
import { HasRoleDirective } from '../../core/has-role.directive';
import { AuthService } from '../../core/auth.service';

@Component({
  selector: 'app-event-detail',
  standalone: true,
  imports: [CommonModule, RouterModule, TranslateModule, HasRoleDirective],
  template: `
    <div *ngIf="loading()">{{ 'common.loading' | translate }}</div>
    <div *ngIf="error()" class="error">{{ error() }}</div>
    <ng-container *ngIf="event() && !loading()">
      <h2>{{ 'events.detailTitle' | translate }}: {{ event()?.title }}</h2>
      <p class="desc" *ngIf="event()?.description">{{ event()?.description }}</p>
      <div class="meta">
        <div><strong>{{ 'events.startDate' | translate }}:</strong> {{ event()?.startDate | date:'yyyy-MM-dd' }}</div>
        <div><strong>{{ 'events.endDate' | translate }}:</strong> {{ event()?.endDate | date:'yyyy-MM-dd' }}</div>
        <div><strong>{{ 'events.capacity' | translate }}:</strong> {{ registrationsCount() }}/{{ event()?.maxRegistrations }}</div>
      </div>
        <div class="status" *ngIf="feedback()">{{ (feedback() || '') | translate }}</div>
      <button *ngIf="canShowRegisterButton()"
              class="register-btn"
              (click)="register()"
              [disabled]="isFull() || hasRegistered() || !canRegister()">
        {{ hasRegistered() ? ('events.alreadyRegistered' | translate) : ('events.register' | translate) }}
      </button>
      <div class="manage" *hasRole="['admin','staff']">
        <a [routerLink]="['/attendance', event()?.id]">{{ 'attendance.title' | translate }}</a> |
        <a [routerLink]="['/certificates', event()?.id]">{{ 'certificates.title' | translate }}</a>
      </div>

      <div class="participants" *hasRole="['admin','staff']">
        <h3>{{ 'events.participants' | translate }}</h3>
        <table *ngIf="registrations().length > 0" class="participants-table">
          <thead>
            <tr>
              <th>{{ 'auth.name' | translate }}</th>
              <th>{{ 'auth.email' | translate }}</th>
              <th>{{ 'events.role' | translate }}</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let reg of registrations()">
              <td>{{ reg.member.name }}</td>
              <td>{{ reg.member.email }}</td>
              <td>{{ reg.member.role }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </ng-container>
  `,
  styles: [`
    h2 { margin:0 0 0.75rem; font-size:1.2rem; }
    h3 { margin:1.5rem 0 0.75rem; font-size:1rem; }
    .meta { display:flex; gap:1.25rem; flex-wrap:wrap; margin-bottom:0.75rem; font-size:0.85rem; }
    .desc { margin:0 0 0.75rem; font-size:0.85rem; }
    .register-btn { padding:0.5rem 0.9rem; background:#0066cc; color:#fff; border:none; border-radius:4px; cursor:pointer; font-size:0.8rem; }
    .register-btn:disabled { opacity:0.45; cursor:not-allowed; }
    .error { color:#d9534f; margin:0.5rem 0; }
    .status { margin:0.5rem 0; font-size:0.8rem; color:#2d6a2d; }
    .participants { margin-top: 2rem; }
    .participants-table { width:100%; border-collapse: collapse; background:#fff; margin-top: 0.5rem; }
    .participants-table th, .participants-table td { padding:0.5rem 0.75rem; border:1px solid #ddd; font-size:0.85rem; text-align: left; }
    .promote-btn { padding:0.35rem 0.6rem; font-size:0.75rem; background:#ff8c00; color:#fff; border:none; border-radius:4px; cursor:pointer; }
  `]
})
export class EventDetailComponent {
  private route = inject(ActivatedRoute);
  private api = inject(ApiService);
  private auth = inject(AuthService);

  loading = signal(true);
  error = signal<string | null>(null);
  event = signal<any | null>(null);
  registrationsCount = signal(0);
  hasRegistered = signal(false);
  feedback = signal<string | null>(null);
  registrations = signal<any[]>([]);

  constructor() {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (!idParam) {
      this.error.set('Invalid event id');
      this.loading.set(false);
      return;
    }
    const eventId = idParam;
    this.api.getEvent(eventId).subscribe({
      next: ev => {
        this.event.set(ev);
        this.loadRegistrations(eventId);
      },
      error: err => {
        this.error.set(err?.error?.message || 'Failed to load event');
        this.loading.set(false);
      }
    });
  }

  private loadRegistrations(eventId: string) {
    this.api.getEventRegistrations(eventId).subscribe({
      next: regs => {
        this.registrations.set(regs);
        this.registrationsCount.set(regs.length);
        const user = this.auth.currentUserValue;
        if (user) {
          this.hasRegistered.set(regs.some(r => String(r.member.id) === String(user.id)));
        }
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
      }
    });
  }

  isFull(): boolean {
    return !!this.event() && this.registrationsCount() >= this.event()!.maxRegistrations;
  }

  canRegister(): boolean {
    return !!this.auth.currentUserValue;
  }

  canShowRegisterButton(): boolean {
    const ev = this.event();
    if (!ev) return false;

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const startDate = new Date(ev.startDate);
    startDate.setHours(0, 0, 0, 0);

    return startDate > today;
  }

  register() {
    const ev = this.event();
    if (!ev) return;
    if (!this.canRegister()) {
      this.error.set('Please login first');
      return;
    }
    if (this.isFull() || this.hasRegistered()) return;
    const userId = Number(this.auth.currentUserValue!.id);
    this.api.register(String(ev.id), String(userId)).subscribe({
      next: () => {
        this.registrationsCount.set(this.registrationsCount() + 1);
        this.hasRegistered.set(true);
        this.feedback.set('events.registerSuccess');
      },
      error: err => {
        this.error.set(err?.error?.message || 'events.registerError');
      }
    });
  }
}
