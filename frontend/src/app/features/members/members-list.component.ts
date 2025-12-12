import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../core/api.service';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-members-list',
  standalone: true,
  imports: [CommonModule, TranslateModule, FormsModule],
  template: `
    <h2>{{ 'members.title' | translate }}</h2>
    <div *ngIf="loading()">{{ 'common.loading' | translate }}</div>
    <div class="error" *ngIf="error()">{{ error() }}</div>
    <div class="success" *ngIf="success()">{{ success() }}</div>
    <div *ngIf="!loading() && members().length === 0">{{ 'members.empty' | translate }}</div>
    <table *ngIf="members().length > 0" class="members-table">
      <thead>
        <tr>
          <th>{{ 'auth.name' | translate }}</th>
          <th>{{ 'auth.email' | translate }}</th>
          <th>{{ 'members.role' | translate }}</th>
          <th>{{ 'auth.birthDate' | translate }}</th>
        </tr>
      </thead>
      <tbody>
        <tr *ngFor="let member of members()">
          <td>{{ member.name }}</td>
          <td>{{ member.email }}</td>
          <td>
            <select [value]="member.role"
                    (change)="changeRole(member, $any($event.target).value)"
                    class="role-select">
              <option value="participant">{{ 'members.roles.participant' | translate }}</option>
              <option value="staff">{{ 'members.roles.staff' | translate }}</option>
              <option value="admin">{{ 'members.roles.admin' | translate }}</option>
            </select>
          </td>
          <td>{{ member.birthDate ? (member.birthDate | date:'yyyy-MM-dd') : '-' }}</td>
        </tr>
      </tbody>
    </table>
  `,
  styles: [`
    h2 { margin-bottom: 1rem; }
    .members-table { width:100%; border-collapse: collapse; background:#fff; box-shadow: 0 1px 3px rgba(0,0,0,0.1); }
    .members-table th, .members-table td { padding:0.75rem 1rem; border:1px solid #ddd; font-size:0.9rem; text-align: left; }
    .members-table th { background:#f5f5f5; font-weight:600; }
    .role-select { padding:0.4rem 0.6rem; font-size:0.85rem; border:1px solid #ccc; border-radius:4px; background:#fff; cursor:pointer; }
    .error { color:#d9534f; margin-bottom:0.75rem; padding:0.5rem; background:#f8d7da; border-radius:4px; }
    .success { color:#28a745; margin-bottom:0.75rem; padding:0.5rem; background:#d4edda; border-radius:4px; }
  `]
})
export class MembersListComponent {
  private api = inject(ApiService);
  loading = signal(true);
  error = signal<string | null>(null);
  success = signal<string | null>(null);
  members = signal<any[]>([]);

  constructor() {
    this.loadMembers();
  }

  loadMembers() {
    this.api.getAllMembers().subscribe({
      next: members => {
        this.members.set(members);
        this.loading.set(false);
      },
      error: err => {
        this.error.set(err?.error?.message || 'Failed to load members');
        this.loading.set(false);
      }
    });
  }

  changeRole(member: any, newRole: string) {
    if (member.role === newRole) return;

    this.error.set(null);
    this.success.set(null);

    const oldRole = member.role;
    member.role = newRole;
    this.members.set([...this.members()]);

    this.api.changeUserRole(String(member.id), newRole).subscribe({
      next: () => {
        this.success.set('Role updated successfully');
        setTimeout(() => this.success.set(null), 3000);
      },
      error: err => {
        member.role = oldRole;
        this.members.set([...this.members()]);
        this.error.set(err?.error?.message || 'Failed to update role');
      }
    });
  }
}
