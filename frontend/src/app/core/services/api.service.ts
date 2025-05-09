import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private baseUrl = 'http://localhost:3000/api';

  constructor(private http: HttpClient) {}

  // Auth endpoints
  login(username: string, password: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/auth/login`, { username, password });
  }

  refreshToken(): Observable<any> {
    return this.http.post(`${this.baseUrl}/auth/refresh`, {});
  }

  logout(): Observable<any> {
    return this.http.post(`${this.baseUrl}/auth/logout`, {});
  }

  // Entity endpoints
  getEntities(): Observable<any> {
    return this.http.get(`${this.baseUrl}/entities`);
  }

  impersonateEntity(entityId: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/auth/impersonate`, { entityId });
  }

  // Device endpoints
  getDevices(): Observable<any> {
    return this.http.get(`${this.baseUrl}/devices`);
  }

  getDevice(id: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/devices/${id}`);
  }

  createDevice(device: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/devices`, device);
  }

  updateDevice(id: string, device: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/devices/${id}`, device);
  }

  deleteDevice(id: string): Observable<any> {
    return this.http.delete(`${this.baseUrl}/devices/${id}`);
  }

  // Budget endpoints
  getBudgets(): Observable<any> {
    return this.http.get(`${this.baseUrl}/budgets`);
  }

  getBudget(id: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/budgets/${id}`);
  }

  createBudget(budget: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/budgets`, budget);
  }

  updateBudget(id: string, budget: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/budgets/${id}`, budget);
  }

  deleteBudget(id: string): Observable<any> {
    return this.http.delete(`${this.baseUrl}/budgets/${id}`);
  }
} 