import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  // Using environment variables for API URL
  private baseUrl = environment.apiUrl;
  private authUrl = `${this.baseUrl}${environment.authApiPath}`;
  private entitiesUrl = `${this.baseUrl}${environment.entityApiPath}`;
  private devicesUrl = `${this.baseUrl}${environment.deviceApiPath}`;
  private budgetsUrl = `${this.baseUrl}${environment.budgetApiPath}`;
  private notificationsUrl = `${this.baseUrl}${environment.notificationApiPath}`;

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
    // This endpoint is not implemented yet, so we'll return a mock response
    return of({ access_token: this.getToken() });
  }

  logout(): Observable<any> {
    return this.post('/auth/logout', {});
  }

  getProfile(): Observable<any> {
    return this.get('/auth/me');
  }

  getToken(): string {
    return localStorage.getItem('token') || '';
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

  getBudgetStatistics(entityId?: number): Observable<any> {
    let url = `${this.baseUrl}/budgets/statistics`;
    
    // Add entityId as a query parameter if provided
    if (entityId) {
      url = `${url}?entityId=${entityId}`;
    }
    
    return this.http.get<any>(url);
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

  // Test endpoints
  testDevicesAccess(): Observable<any> {
    console.log('Testing device access with token:', this.getToken());
    return this.get('/devices');
  }

  testAuth(): Observable<any> {
    console.log('Testing auth with token:', this.getToken());
    return this.get('/devices/test');
  }
} 