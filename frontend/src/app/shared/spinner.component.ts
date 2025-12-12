import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoadingService } from '../core/loading.service';

@Component({
  selector: 'app-spinner',
  standalone: true,
  imports: [CommonModule],
  template: `<div *ngIf="loading.active()" class="spinner" aria-label="loading"></div>`
})
export class SpinnerComponent {
  loading = inject(LoadingService);
}
