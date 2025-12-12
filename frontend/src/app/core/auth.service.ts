import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Member } from './models';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:3000/auth';
  private currentUserSubject = new BehaviorSubject<Member | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor() {
    this.initializeAuth();
  }

  private initializeAuth() {
    const token = this.getToken();
    const userData = localStorage.getItem('user');
    if (token && userData) {
      try {
        const user = JSON.parse(userData);
        this.currentUserSubject.next(user);
      } catch (e) {
        console.error('Failed to parse user data', e);
        this.logout();
      }
    }
  }

  get currentUserValue(): Member | null {
    return this.currentUserSubject.value;
  }

  login(email: string, password: string): Observable<{ accessToken: string; member: Member }> {
    return this.http.post<{ accessToken: string; member: Member }>(`${this.apiUrl}/login`, { email, password })
      .pipe(tap(res => {
        localStorage.setItem('token', res.accessToken);
        localStorage.setItem('user', JSON.stringify(res.member));
        this.currentUserSubject.next(res.member);
      }));
  }

  register(name: string, email: string, password: string, birthDate: string, gender?: string): Observable<Member> {
    return this.http.post<Member>(`${this.apiUrl}/register`, { name, email, password, birthDate, gender });
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.currentUserSubject.next(null);
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }
}
