import { Injectable } from '@angular/core';
import { Observable, map, of, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { ApiService } from '../../../core/services/api.service';
import { Device, CreateDeviceDto, UpdateDeviceDto } from '../models/device.model';

@Injectable({
  providedIn: 'root'
})
export class HardwareService {
  constructor(private apiService: ApiService) {}

  private mapDeviceFromApi(apiDevice: any): Device {
    // Handle potential null/undefined values
    if (!apiDevice) {
      console.warn('Received null or undefined device from API');
      return {
        id: 0,
        nsn: '',
        type: 'Kiosk',
        manufacturer: '',
        model: '',
        location: '',
        endOfLife: new Date(),
        status: 'Active',
        eligibleUpgrade: 'No',
        entityId: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
    }
    
    console.log('Mapping device from API:', apiDevice);
    
    return {
      id: apiDevice.id || 0,
      nsn: apiDevice.nsn || apiDevice.serialNumber || '',
      type: apiDevice.type || apiDevice.deviceType || 'Kiosk',
      manufacturer: apiDevice.manufacturer || (apiDevice.entity?.name || ''),
      model: apiDevice.model || '',
      location: apiDevice.location || (apiDevice.entity?.description || ''),
      endOfLife: apiDevice.endOfLife ? new Date(apiDevice.endOfLife) : 
                (apiDevice.warrantyExpiration ? new Date(apiDevice.warrantyExpiration) : new Date()),
      status: apiDevice.status || apiDevice.deviceStatus || 'Active',
      eligibleUpgrade: apiDevice.eligibleUpgrade || 
                      (apiDevice.warrantyExpiration && new Date(apiDevice.warrantyExpiration) < new Date() ? 'Yes' : 'No'),
      entityId: apiDevice.entityId || 1,
      createdAt: apiDevice.createdAt ? new Date(apiDevice.createdAt) : new Date(),
      updatedAt: apiDevice.updatedAt ? new Date(apiDevice.updatedAt) : new Date(),
    };
  }

  private mapDeviceToApi(device: CreateDeviceDto | UpdateDeviceDto): any {
    // Ensure we have proper date formats for the API
    const endOfLife = device.endOfLife instanceof Date 
      ? device.endOfLife.toISOString() 
      : (device.endOfLife ? new Date(device.endOfLife).toISOString() : new Date().toISOString());
    
    console.log('Mapping device to API:', device);
    
    // Convert the frontend Device model to the format expected by the API
    return {
      nsn: device.nsn,
      type: device.type,
      manufacturer: device.manufacturer,
      model: device.model,
      location: device.location,
      endOfLife: endOfLife,
      status: device.status,
      eligibleUpgrade: device.eligibleUpgrade,
      entityId: device.entityId || 1
    };
  }

  getDevices(entityId?: number): Observable<Device[]> {
    return this.apiService.getDevices(entityId).pipe(
      tap(response => console.log('API response for getDevices:', response)),
      map(devices => Array.isArray(devices) ? devices.map((device: any) => this.mapDeviceFromApi(device)) : []),
      catchError(error => {
        console.error('Error fetching devices:', error);
        return throwError(() => new Error('Failed to load devices. Please try again later.'));
      })
    );
  }

  getDevice(id: number): Observable<Device> {
    return this.apiService.getDevice(id).pipe(
      tap(response => console.log('API response for getDevice:', response)),
      map(device => this.mapDeviceFromApi(device)),
      catchError(error => {
        console.error(`Error fetching device with ID ${id}:`, error);
        return throwError(() => new Error('Failed to load device details. Please try again later.'));
      })
    );
  }

  createDevice(device: CreateDeviceDto): Observable<Device> {
    const apiDevice = this.mapDeviceToApi(device);
    console.log('Creating device with data:', apiDevice);
    
    return this.apiService.createDevice(apiDevice).pipe(
      tap(response => console.log('API response for createDevice:', response)),
      map(response => this.mapDeviceFromApi(response)),
      catchError(error => {
        console.error('Error creating device:', error);
        return throwError(() => new Error(`Failed to create device: ${this.extractErrorMessage(error)}`));
      })
    );
  }

  updateDevice(id: number, device: UpdateDeviceDto): Observable<Device> {
    const apiDevice = this.mapDeviceToApi(device);
    console.log(`Updating device ${id} with data:`, apiDevice);
    
    return this.apiService.updateDevice(id, apiDevice).pipe(
      tap(response => console.log('API response for updateDevice:', response)),
      map(response => this.mapDeviceFromApi(response)),
      catchError(error => {
        console.error(`Error updating device with ID ${id}:`, error);
        return throwError(() => new Error(`Failed to update device: ${this.extractErrorMessage(error)}`));
      })
    );
  }

  deleteDevice(id: number): Observable<void> {
    return this.apiService.deleteDevice(id).pipe(
      tap(response => console.log('API response for deleteDevice:', response)),
      catchError(error => {
        console.error(`Error deleting device with ID ${id}:`, error);
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