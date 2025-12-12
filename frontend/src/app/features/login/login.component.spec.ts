import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { LoginComponent } from './login.component';
import { AuthService } from '../../core/auth.service';
import { TranslateModule } from '@ngx-translate/core';

class AuthServiceMock {
  login = jasmine.createSpy('login').and.callFake((email: string, password: string) => {
    if (email === 'fail@example.com') {
      return throwError(() => ({ error: { message: 'Invalid credentials' } }));
    }
    return of({ accessToken: 'token', member: { id: '1', email, name: 'Test', role: 'participant' } });
  });
}

class RouterMock { navigateByUrl = jasmine.createSpy('navigateByUrl'); }

describe('LoginComponent', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [LoginComponent, TranslateModule.forRoot()],
      providers: [
        { provide: AuthService, useClass: AuthServiceMock },
        { provide: Router, useClass: RouterMock }
      ]
    });
  });

  it('should create', () => {
    const fixture = TestBed.createComponent(LoginComponent);
    const comp = fixture.componentInstance;
    expect(comp).toBeTruthy();
  });

  it('should call authService.login and navigate on success', () => {
    const fixture = TestBed.createComponent(LoginComponent);
    const comp = fixture.componentInstance;
    const auth = TestBed.inject(AuthService) as any;
    const router = TestBed.inject(Router) as any;

    comp.form.setValue({ email: 'user@example.com', password: 'password123' });
    comp.submit();

    expect(auth.login).toHaveBeenCalledWith('user@example.com', 'password123');
    expect(router.navigateByUrl).toHaveBeenCalledWith('/events');
    expect(comp.error()).toBeNull();
  });

  it('should set error signal on failed login', () => {
    const fixture = TestBed.createComponent(LoginComponent);
    const comp = fixture.componentInstance;

    comp.form.setValue({ email: 'fail@example.com', password: 'password123' });
    comp.submit();

    expect(comp.error()).toEqual('Invalid credentials');
  });

  it('should not submit when form invalid', () => {
    const fixture = TestBed.createComponent(LoginComponent);
    const comp = fixture.componentInstance;
    const auth = TestBed.inject(AuthService) as any;

    comp.form.setValue({ email: '', password: '' });
    comp.submit();

    expect(auth.login).not.toHaveBeenCalled();
  });
});
