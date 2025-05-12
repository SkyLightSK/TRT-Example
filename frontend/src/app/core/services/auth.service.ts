import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';
import { ApiService } from './api.service';

export interface User {
  id: number;
  username: string;
  email: string;
  role: string;
}

export interface AuthResponse {
  access_token: string;
  user: User;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  private tokenExpirationTimer: any;

  public currentUser$ = this.currentUserSubject.asObservable();
  
  constructor(
    private http: HttpClient,
    private router: Router,
    private apiService: ApiService
  ) {
    this.loadStoredAuthData();
  }

  private loadStoredAuthData(): void {
    const token = localStorage.getItem('token');
    const userJson = localStorage.getItem('user');
    
    if (token && userJson) {
      try {
        const user = JSON.parse(userJson);
        this.currentUserSubject.next(user);
      } catch (error) {
        console.error('Failed to parse stored user data', error);
        this.logout();
      }
    }
  }

  login(username: string, password: string): Observable<AuthResponse> {
    return this.apiService.login(username, password)
      .pipe(
        tap(response => this.handleAuthentication(response)),
        catchError(error => {
          console.error('Login error:', error);
          return throwError(() => new Error(error.error?.message || 'Login failed'));
        })
      );
  }

  logout(): void {
    // Clear token and user data from storage
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    
    // Clear current user subject
    this.currentUserSubject.next(null);
    
    // Clear any token expiration timer
    if (this.tokenExpirationTimer) {
      clearTimeout(this.tokenExpirationTimer);
      this.tokenExpirationTimer = null;
    }
    
    // Redirect to login page
    this.router.navigate(['/login']);
  }

  refreshToken(): Observable<string> {
    return this.apiService.refreshToken()
      .pipe(
        map(response => {
          localStorage.setItem('token', response.access_token);
          return response.access_token;
        }),
        catchError(error => {
          this.logout();
          return throwError(() => new Error('Session expired. Please login again.'));
        })
      );
  }

  getProfile(): Observable<User> {
    return this.apiService.getProfile()
      .pipe(
        tap(user => {
          localStorage.setItem('user', JSON.stringify(user));
          this.currentUserSubject.next(user);
        })
      );
  }

  impersonateEntity(entityId: number): Observable<{ access_token: string }> {
    return this.apiService.impersonateEntity(entityId)
      .pipe(
        tap(response => {
          localStorage.setItem('token', response.access_token);
          // After impersonation, refresh the user profile
          this.getProfile().subscribe();
        })
      );
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  hasRole(role: string): boolean {
    const user = this.getCurrentUser();
    
    if (!user) {
      return false;
    }
    
    // Check if user has the admin role
    if (role === 'ADMIN') {
      return user.role.toUpperCase() === 'ADMIN';
    }
    
    return user.role === role;
  }

  private handleAuthentication(authData: AuthResponse): void {
    const { access_token, user } = authData;
    
    // Store auth data in local storage
    localStorage.setItem('token', access_token);
    localStorage.setItem('user', JSON.stringify(user));
    
    // Update current user
    this.currentUserSubject.next(user);
  }
} 