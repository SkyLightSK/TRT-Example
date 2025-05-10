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

  getProfile(): Observable<any> {
    return this.http.get(`${this.baseUrl}/auth/me`);
  }

  // Entity endpoints
  getEntities(): Observable<any> {
    return this.http.get(`${this.baseUrl}/entities`);
  }

  getEntity(id: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/entities/${id}`);
  }

  createEntity(entity: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/entities`, entity);
  }

  updateEntity(id: number, entity: any): Observable<any> {
    return this.http.patch(`${this.baseUrl}/entities/${id}`, entity);
  }

  deleteEntity(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/entities/${id}`);
  }

  impersonateEntity(entityId: number): Observable<any> {
    return this.http.post(`${this.baseUrl}/auth/impersonate`, { entityId });
  }

  // Device endpoints
  getDevices(entityId?: number): Observable<any> {
    let url = `${this.baseUrl}/devices`;
    if (entityId) {
      url += `?entityId=${entityId}`;
    }
    return this.http.get(url);
  }

  getDevice(id: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/devices/${id}`);
  }

  createDevice(device: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/devices`, device);
  }

  updateDevice(id: number, device: any): Observable<any> {
    return this.http.patch(`${this.baseUrl}/devices/${id}`, device);
  }

  deleteDevice(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/devices/${id}`);
  }

  // Budget endpoints
  getBudgets(fiscalYear?: number): Observable<any> {
    let url = `${this.baseUrl}/budgets`;
    if (fiscalYear) {
      url += `?fiscalYear=${fiscalYear}`;
    }
    return this.http.get(url);
  }

  getBudget(id: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/budgets/${id}`);
  }

  createBudget(budget: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/budgets`, budget);
  }

  updateBudget(id: number, budget: any): Observable<any> {
    return this.http.patch(`${this.baseUrl}/budgets/${id}`, budget);
  }

  deleteBudget(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/budgets/${id}`);
  }
  
  // Budget Items endpoints
  getBudgetItems(): Observable<any> {
    return this.http.get(`${this.baseUrl}/budgets/items`);
  }
  
  getBudgetItem(id: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/budgets/items/${id}`);
  }
} 