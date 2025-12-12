import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class LoadingService {
  active = signal(false);
  private counter = 0;

  show() {
    this.counter++; this.active.set(true);
  }
  hide() {
    if (this.counter > 0) this.counter--; 
    if (this.counter === 0) this.active.set(false);
  }
}
