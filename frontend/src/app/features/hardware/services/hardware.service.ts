import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ApiService } from '../../../core/services/api.service';
import { Device, CreateDeviceDto, UpdateDeviceDto } from '../models/device.model';

@Injectable({
  providedIn: 'root'
})
export class HardwareService {
  constructor(private apiService: ApiService) {}

  getDevices(entityId?: number): Observable<Device[]> {
    return this.apiService.getDevices(entityId).pipe(
      catchError(error => {
        return throwError(() => new Error('Failed to load devices. Please try again later.'));
      })
    );
  }

  getDevice(id: number): Observable<Device> {
    return this.apiService.getDevice(id).pipe(
      catchError(error => {
        return throwError(() => new Error('Failed to load device details. Please try again later.'));
      })
    );
  }

  createDevice(device: CreateDeviceDto): Observable<Device> {
    return this.apiService.createDevice(device).pipe(
      catchError(error => {
        return throwError(() => new Error(`Failed to create device: ${this.extractErrorMessage(error)}`));
      })
    );
  }

  updateDevice(id: number, device: UpdateDeviceDto): Observable<Device> {
    return this.apiService.updateDevice(id, device).pipe(
      catchError(error => {
        return throwError(() => new Error(`Failed to update device: ${this.extractErrorMessage(error)}`));
      })
    );
  }

  deleteDevice(id: number): Observable<void> {
    return this.apiService.deleteDevice(id).pipe(
      catchError(error => {
        return throwError(() => new Error(`Failed to delete device: ${this.extractErrorMessage(error)}`));
      })
    );
  }
  
  // Extract readable error message from HTTP error
  private extractErrorMessage(error: any): string {
    if (!error) {
      return 'Unknown error occurred';
    }
    
    if (error.error?.message) {
      return error.error.message;
    }
    
    if (error.message) {
      return error.message;
    }
    
    if (typeof error === 'string') {
      return error;
    }
    
    return 'Please check your input and try again';
  }
} 