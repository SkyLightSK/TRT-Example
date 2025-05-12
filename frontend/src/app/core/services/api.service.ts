import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
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

  // Auth endpoints
  login(username: string, password: string): Observable<any> {
    return this.http.post(`${this.authUrl}/login`, { username, password });
  }

  refreshToken(): Observable<any> {
    return this.http.post(`${this.authUrl}/refresh`, {});
  }

  logout(): Observable<any> {
    return this.http.post(`${this.authUrl}/logout`, {});
  }

  getProfile(): Observable<any> {
    return this.http.get(`${this.authUrl}/me`);
  }

  // Entity endpoints
  getEntities(): Observable<any> {
    return this.http.get(`${this.entitiesUrl}`);
  }

  getEntity(id: number): Observable<any> {
    return this.http.get(`${this.entitiesUrl}/${id}`);
  }

  createEntity(entity: any): Observable<any> {
    return this.http.post(`${this.entitiesUrl}`, entity);
  }

  updateEntity(id: number, entity: any): Observable<any> {
    return this.http.patch(`${this.entitiesUrl}/${id}`, entity);
  }

  deleteEntity(id: number): Observable<any> {
    return this.http.delete(`${this.entitiesUrl}/${id}`);
  }

  impersonateEntity(entityId: number): Observable<any> {
    return this.http.post(`${this.authUrl}/impersonate`, { entityId });
  }

  // Device endpoints
  getDevices(entityId?: number): Observable<any> {
    let url = `${this.devicesUrl}`;
    if (entityId) {
      url += `?entityId=${entityId}`;
    }
    return this.http.get(url);
  }

  getDevice(id: number): Observable<any> {
    return this.http.get(`${this.devicesUrl}/${id}`);
  }

  createDevice(device: any): Observable<any> {
    return this.http.post(`${this.devicesUrl}`, device);
  }

  updateDevice(id: number, device: any): Observable<any> {
    return this.http.patch(`${this.devicesUrl}/${id}`, device);
  }

  deleteDevice(id: number): Observable<any> {
    return this.http.delete(`${this.devicesUrl}/${id}`);
  }

  // Budget endpoints
  getBudgets(fiscalYear?: number): Observable<any> {
    let url = `${this.budgetsUrl}`;
    if (fiscalYear) {
      url += `?fiscalYear=${fiscalYear}`;
    }
    return this.http.get(url);
  }

  getBudget(id: number): Observable<any> {
    return this.http.get(`${this.budgetsUrl}/${id}`);
  }

  createBudget(budget: any): Observable<any> {
    return this.http.post(`${this.budgetsUrl}`, budget);
  }

  updateBudget(id: number, budget: any): Observable<any> {
    return this.http.patch(`${this.budgetsUrl}/${id}`, budget);
  }

  deleteBudget(id: number): Observable<any> {
    return this.http.delete(`${this.budgetsUrl}/${id}`);
  }
  
  // Budget Items endpoints
  getBudgetItems(budgetId?: number): Observable<any> {
    let url = `${this.budgetsUrl}/items`;
    if (budgetId) {
      url += `?budgetId=${budgetId}`;
    }
    return this.http.get(url);
  }
  
  getBudgetItem(id: number): Observable<any> {
    return this.http.get(`${this.budgetsUrl}/items/${id}`);
  }
} 