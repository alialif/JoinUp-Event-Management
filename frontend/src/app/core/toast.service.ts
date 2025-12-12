import { Injectable, signal } from '@angular/core';

export interface Toast { id: number; message: string; type: 'info' | 'error' | 'success'; }

@Injectable({ providedIn: 'root' })
export class ToastService {
  toasts = signal<Toast[]>([]);
  private id = 0;

  push(message: string, type: 'info' | 'error' | 'success' = 'info', ttlMs = 4000) {
    const toast: Toast = { id: ++this.id, message, type };
    this.toasts.update(list => [...list, toast]);
    setTimeout(() => this.remove(toast.id), ttlMs);
  }

  remove(id: number) {
    this.toasts.update(list => list.filter(t => t.id !== id));
  }
}
