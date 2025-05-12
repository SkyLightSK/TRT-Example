import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private baseUrl = 'http://localhost:3000/api';

  constructor(private http: HttpClient) {}

  // Generic HTTP methods
  get<T>(endpoint: string): Observable<T> {
    return this.http.get<T>(`${this.baseUrl}${endpoint}`);
  }

  post<T>(endpoint: string, data: any): Observable<T> {
    return this.http.post<T>(`${this.baseUrl}${endpoint}`, data);
  }

  patch<T>(endpoint: string, data: any): Observable<T> {
    return this.http.patch<T>(`${this.baseUrl}${endpoint}`, data);
  }

  delete<T>(endpoint: string): Observable<T> {
    return this.http.delete<T>(`${this.baseUrl}${endpoint}`);
  }

  // Auth endpoints
  login(username: string, password: string): Observable<any> {
    return this.post('/auth/login', { username, password });
  }

  refreshToken(): Observable<any> {
    return this.post('/auth/refresh', {});
  }

  logout(): Observable<any> {
    return this.post('/auth/logout', {});
  }

  getProfile(): Observable<any> {
    return this.get('/auth/me');
  }

  // User endpoints
  getUsers(): Observable<any> {
    return this.get('/users');
  }

  getUser(id: number): Observable<any> {
    return this.get(`/users/${id}`);
  }

  createUser(user: any): Observable<any> {
    return this.post('/users', user);
  }

  updateUser(id: number, user: any): Observable<any> {
    return this.patch(`/users/${id}`, user);
  }

  deleteUser(id: number): Observable<any> {
    return this.delete(`/users/${id}`);
  }

  // Entity endpoints
  getEntities(): Observable<any> {
    return this.get('/entities');
  }

  getEntity(id: number): Observable<any> {
    return this.get(`/entities/${id}`);
  }

  createEntity(entity: any): Observable<any> {
    return this.post('/entities', entity);
  }

  updateEntity(id: number, entity: any): Observable<any> {
    return this.patch(`/entities/${id}`, entity);
  }

  deleteEntity(id: number): Observable<any> {
    return this.delete(`/entities/${id}`);
  }

  impersonateEntity(entityId: number): Observable<any> {
    return this.post('/auth/impersonate', { entityId });
  }

  // Device endpoints
  getDevices(entityId?: number): Observable<any> {
    let url = '/devices';
    if (entityId) {
      url += `?entityId=${entityId}`;
    }
    return this.get(url);
  }

  getDevice(id: number): Observable<any> {
    return this.get(`/devices/${id}`);
  }

  createDevice(device: any): Observable<any> {
    return this.post('/devices', device);
  }

  updateDevice(id: number, device: any): Observable<any> {
    return this.patch(`/devices/${id}`, device);
  }

  deleteDevice(id: number): Observable<any> {
    return this.delete(`/devices/${id}`);
  }

  // Budget endpoints
  getBudgets(fiscalYear?: number): Observable<any> {
    let url = '/budgets';
    if (fiscalYear) {
      url += `?fiscalYear=${fiscalYear}`;
    }
    return this.get(url);
  }

  getBudget(id: number): Observable<any> {
    return this.get(`/budgets/${id}`);
  }

  createBudget(budget: any): Observable<any> {
    return this.post('/budgets', budget);
  }

  updateBudget(id: number, budget: any): Observable<any> {
    return this.patch(`/budgets/${id}`, budget);
  }

  deleteBudget(id: number): Observable<any> {
    return this.delete(`/budgets/${id}`);
  }
  
  // Budget Items endpoints
  getBudgetItems(budgetId?: number): Observable<any> {
    let url = '/budgets/items';
    if (budgetId) {
      url += `?budgetId=${budgetId}`;
    }
    return this.get(url);
  }
  
  getBudgetItem(id: number): Observable<any> {
    return this.get(`/budgets/items/${id}`);
  }
} 