import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from '../../core/api.service';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-event-create',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, TranslateModule],
  template: `
    <div class="create-container">
      <h2>{{ 'events.createEvent' | translate }}</h2>
      <form [formGroup]="form" (ngSubmit)="submit()" novalidate>
        <div class="field">
          <label for="title">{{ 'events.eventTitle' | translate }}</label>
          <input id="title" type="text" formControlName="title"
                 [class.invalid]="form.controls.title.invalid && form.controls.title.touched" />
        </div>
        <div class="field">
          <label for="description">{{ 'events.description' | translate }}</label>
          <textarea id="description" formControlName="description" rows="4"
                    [class.invalid]="form.controls.description.invalid && form.controls.description.touched"></textarea>
        </div>
        <div class="field">
          <label for="startDate">{{ 'events.startDate' | translate }}</label>
          <input id="startDate" type="date" formControlName="startDate"
                 [class.invalid]="form.controls.startDate.invalid && form.controls.startDate.touched" />
        </div>
        <div class="field">
          <label for="endDate">{{ 'events.endDate' | translate }}</label>
          <input id="endDate" type="date" formControlName="endDate"
                 [class.invalid]="form.controls.endDate.invalid && form.controls.endDate.touched" />
        </div>
        <div class="field">
          <label for="maxRegistrations">{{ 'events.maxRegistrations' | translate }}</label>
          <input id="maxRegistrations" type="number" formControlName="maxRegistrations"
                 [class.invalid]="form.controls.maxRegistrations.invalid && form.controls.maxRegistrations.touched" />
        </div>
        <div class="field" formGroupName="categories">
          <label>{{ 'events.categories' | translate }}</label>
          <div class="checkbox-group">
            <label class="checkbox-label">
              <input type="checkbox" formControlName="conference" />
              {{ 'events.categoryConference' | translate }}
            </label>
            <label class="checkbox-label">
              <input type="checkbox" formControlName="workshop" />
              {{ 'events.categoryWorkshop' | translate }}
            </label>
            <label class="checkbox-label">
              <input type="checkbox" formControlName="meetup" />
              {{ 'events.categoryMeetup' | translate }}
            </label>
            <label class="checkbox-label">
              <input type="checkbox" formControlName="webinar" />
              {{ 'events.categoryWebinar' | translate }}
            </label>
          </div>
        </div>
        <div class="field">
          <label>{{ 'events.price' | translate }}</label>
          <div class="radio-group">
            <label class="radio-label">
              <input type="radio" formControlName="price" value="free" />
              {{ 'events.priceFree' | translate }}
            </label>
            <label class="radio-label">
              <input type="radio" formControlName="price" value="paid" />
              {{ 'events.pricePaid' | translate }}
            </label>
          </div>
        </div>
        <div class="actions">
          <button type="submit" [disabled]="loading() || form.invalid">{{ 'events.save' | translate }}</button>
          <button type="button" (click)="cancel()">{{ 'events.cancel' | translate }}</button>
        </div>
      </form>
      <div class="error" *ngIf="error()">{{ error() }}</div>
      <div class="loading" *ngIf="loading()">{{ 'common.loading' | translate }}</div>
    </div>
  `,
  styles: [`
    .create-container { max-width: 600px; margin: 0 auto; padding: 1rem; }
    h2 { margin-bottom: 1rem; }
    .field { margin-bottom: 1rem; }
    label { display: block; margin-bottom: 0.25rem; font-weight: 500; font-size: 0.9rem; }
    input, textarea, select { width: 100%; padding: 0.5rem; border: 1px solid #ccc; border-radius: 4px; font-size: 0.9rem; }
    input.invalid, textarea.invalid, select.invalid { border-color: #d9534f; }
    .checkbox-group, .radio-group { display: flex; flex-direction: column; gap: 0.5rem; margin-top: 0.5rem; }
    .checkbox-label, .radio-label { display: flex; align-items: center; gap: 0.5rem; font-weight: normal; cursor: pointer; }
    .checkbox-label input, .radio-label input { width: auto; margin: 0; }
    .actions { display: flex; gap: 0.5rem; margin-top: 1rem; }
    button { padding: 0.5rem 1rem; border: none; border-radius: 4px; cursor: pointer; font-size: 0.9rem; }
    button[type="submit"] { background: #0066cc; color: #fff; }
    button[type="button"] { background: #ccc; color: #333; }
    button:disabled { opacity: 0.5; cursor: not-allowed; }
    .error { color: #d9534f; margin-top: 1rem; }
    .loading { color: #666; margin-top: 1rem; }
  `]
})
export class EventCreateComponent {
  private fb = inject(FormBuilder);
  private api = inject(ApiService);
  private router = inject(Router);

  loading = signal(false);
  error = signal<string | null>(null);

  form = this.fb.group({
    title: ['', [Validators.required]],
    description: [''],
    startDate: ['', [Validators.required]],
    endDate: ['', [Validators.required]],
    maxRegistrations: [50, [Validators.required, Validators.min(1)]],
    categories: this.fb.group({
      conference: [false],
      workshop: [false],
      meetup: [false],
      webinar: [false]
    }),
    price: ['free', [Validators.required]]
  });

  submit() {
    if (this.form.invalid || this.loading()) return;
    this.loading.set(true);
    this.error.set(null);

    const categoriesObj = this.form.value.categories!;
    const selectedCategories = Object.keys(categoriesObj)
      .filter(key => (categoriesObj as any)[key])
      .map(key => key.charAt(0).toUpperCase() + key.slice(1));

    const eventData = {
      title: this.form.value.title!,
      description: this.form.value.description || '',
      maxRegistrations: this.form.value.maxRegistrations!,
      startDate: new Date(this.form.value.startDate!),
      endDate: new Date(this.form.value.endDate!),
      categories: selectedCategories,
      price: this.form.value.price!
    };

    this.api.createEvent(eventData as any).subscribe({
      next: () => {
        this.loading.set(false);
        this.router.navigateByUrl('/events');
      },
      error: (err) => {
        this.loading.set(false);
        this.error.set(err?.error?.message || 'Failed to create event');
      }
    });
  }  cancel() {
    this.router.navigateByUrl('/events');
  }
}
