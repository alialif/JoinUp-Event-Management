import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from '../../core/api.service';
import { TranslateModule } from '@ngx-translate/core';

interface CertificateView {
  registrationId: string;
  memberEmail: string;
  issued: boolean;
  filePath?: string;
  sequentialCode?: number;
}

@Component({
  selector: 'app-certificates',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  template: `
    <h2>{{ 'certificates.title' | translate }}</h2>
    <div *ngIf="loading()">{{ 'common.loading' | translate }}</div>
    <div class="error" *ngIf="error()">{{ error() }}</div>
    <table *ngIf="!loading() && views().length > 0" class="cert-table">
      <thead>
        <tr>
          <th>{{ 'registrations.registrationCode' | translate }}</th>
          <th>{{ 'auth.email' | translate }}</th>
          <th>{{ 'certificates.issueCertificate' | translate }}</th>
          <th>PDF</th>
        </tr>
      </thead>
      <tbody>
        <tr *ngFor="let v of views()">
          <td>{{ v.registrationId }}</td>
          <td>{{ v.memberEmail }}</td>
          <td>
            <button (click)="issue(v)" [disabled]="v.issued">{{ v.issued ? ('certificates.title' | translate) : ('certificates.issueCertificate' | translate) }}</button>
          </td>
          <td>
            <a *ngIf="v.filePath" [href]="v.filePath" target="_blank">PDF</a>
          </td>
        </tr>
      </tbody>
    </table>
    <div *ngIf="!loading() && views().length === 0">{{ 'registrations.noRegistrations' | translate }}</div>
  `,
  styles: [`
    .cert-table { width:100%; border-collapse: collapse; background:#fff; }
    .cert-table th, .cert-table td { padding:0.4rem 0.6rem; border:1px solid #ddd; font-size:0.75rem; }
    .error { color:#d9534f; margin:0.5rem 0; }
    button { padding:0.3rem 0.6rem; font-size:0.7rem; }
  `]
})
export class CertificatesComponent {
  private route = inject(ActivatedRoute);
  private api = inject(ApiService);

  loading = signal(true);
  error = signal<string | null>(null);
  views = signal<CertificateView[]>([]);
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
        const list: CertificateView[] = regs.map(r => ({
          registrationId: r.id,
          memberEmail: r.member.email,
          issued: !!(r as any).certificate,
          filePath: (r as any).certificate?.filePath,
          sequentialCode: r.sequentialCode
        }));
        this.views.set(list);
        this.loading.set(false);
      },
      error: err => {
        this.error.set(err?.error?.message || 'Failed to load registrations');
        this.loading.set(false);
      }
    });
  }

  issue(v: CertificateView) {
    if (v.issued) return;
    this.api.issueCertificate(v.registrationId).subscribe({
      next: cert => {
        v.issued = true;
        v.filePath = cert.filePath;
        this.views.set([...this.views()]);
      },
      error: err => this.error.set(err?.error?.message || 'Failed to issue certificate')
    });
  }
}
