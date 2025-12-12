import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastService } from '../core/toast.service';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-toast-container',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  template: `
    <div class="toast-container">
      <div *ngFor="let t of toast.toasts()" class="toast" [class.error]="t.type==='error'" [class.success]="t.type==='success'">
        {{ t.message | translate: {} }}
      </div>
    </div>
  `
})
export class ToastContainerComponent {
  toast = inject(ToastService);
}
