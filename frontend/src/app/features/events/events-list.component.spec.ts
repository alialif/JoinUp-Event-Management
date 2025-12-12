import { TestBed } from '@angular/core/testing';
import { of, throwError, Subject } from 'rxjs';
import { EventsListComponent } from './events-list.component';
import { ApiService } from '../../core/api.service';
import { AuthService } from '../../core/auth.service';
import { TranslateModule } from '@ngx-translate/core';

interface EventData { id: number; title: string; description: string; startDate: string; endDate: string; maxRegistrations: number; }
interface RegistrationData { id: string; member: any; }

class ApiServiceMock {
  events: EventData[] = [
    { id: 1, title: 'Bootcamp Day', description: '', startDate: new Date().toISOString(), endDate: new Date().toISOString(), maxRegistrations: 2 },
    { id: 2, title: 'Workshop', description: '', startDate: new Date().toISOString(), endDate: new Date().toISOString(), maxRegistrations: 1 }
  ];
  registrations: Record<number, RegistrationData[]> = {
    1: [ { id: 'r1', member: { id: '10', email: 'a@a.com' } } ],
    2: []
  };
  getEvents() { return of(this.events); }
  getEventRegistrations(id: string) { return of(this.registrations[Number(id)] || []); }
  register(eventId: string, memberId: string) {
    const evRegs = this.registrations[Number(eventId)] || [];    
    if (evRegs.length >= (this.events.find(e => e.id === Number(eventId))!.maxRegistrations)) {
      return throwError(() => ({ error: { message: 'Full' } }));
    }
    evRegs.push({ id: 'newReg', member: { id: memberId, email: 'x@x.com' } });
    this.registrations[Number(eventId)] = evRegs;
    return of({});
  }
}

class AuthServiceMock {
  currentUserSubject = new Subject<any>();
  currentUserValue: any = null;
  currentUser$ = this.currentUserSubject.asObservable();
  isAuthenticated() { return !!this.currentUserValue; }
  setUser(u: any) { this.currentUserValue = u; this.currentUserSubject.next(u); }
}

describe('EventsListComponent', () => {
  let api: ApiServiceMock;
  let auth: AuthServiceMock;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [EventsListComponent, TranslateModule.forRoot()],
      providers: [
        { provide: ApiService, useClass: ApiServiceMock },
        { provide: AuthService, useClass: AuthServiceMock }
      ]
    });
    api = TestBed.inject(ApiService) as any;
    auth = TestBed.inject(AuthService) as any;
  });

  it('should create and load events with capacity', (done) => {
    const fixture = TestBed.createComponent(EventsListComponent);
    const comp = fixture.componentInstance;
    fixture.detectChanges();
    setTimeout(() => {
      expect(comp.events().length).toBe(2);
      const first = comp.events()[0];
      expect(first.registrationsCount).toBe(1);
      done();
    }, 0);
  });

  it('should prevent registration when not authenticated', (done) => {
    const fixture = TestBed.createComponent(EventsListComponent);
    const comp = fixture.componentInstance;
    fixture.detectChanges();
    setTimeout(() => {
      const ev = comp.events()[1];
      comp.register(ev);
      expect(comp.error()).toBe('Please login first');
      done();
    }, 0);
  });

  it('should register user and increment count', (done) => {
    auth.setUser({ id: '99', role: 'participant' });
    const fixture = TestBed.createComponent(EventsListComponent);
    const comp = fixture.componentInstance;
    fixture.detectChanges();
    setTimeout(() => {
      const ev = comp.events()[1]; // initially 0/1
      expect(ev.registrationsCount).toBe(0);
      comp.register(ev);
      expect(ev.registrationsCount).toBe(1);
      done();
    }, 0);
  });

  it('should not register when event full', (done) => {
    auth.setUser({ id: '55', role: 'participant' });
    const fixture = TestBed.createComponent(EventsListComponent);
    const comp = fixture.componentInstance;
    fixture.detectChanges();
    setTimeout(() => {
      const ev = comp.events()[0]; // capacity 2, currently 1
      comp.register(ev); // becomes 2
      comp.register(ev); // attempt over capacity
      expect(ev.registrationsCount).toBeLessThanOrEqual(ev.maxRegistrations);
      done();
    }, 0);
  });
});
