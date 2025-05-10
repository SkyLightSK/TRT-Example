import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { ApiService } from '../../../core/services/api.service';
import { Device, CreateDeviceDto, UpdateDeviceDto } from '../models/device.model';

@Injectable({
  providedIn: 'root'
})
export class HardwareService {
  constructor(private apiService: ApiService) {}

  private mapDeviceFromApi(apiDevice: any): Device {
    // Map backend device to frontend model
    return {
      id: apiDevice.id,
      nsn: apiDevice.serialNumber || 'N/A', // Using serialNumber as NSN
      type: apiDevice.deviceType || 'Kiosk', // Using deviceType as type
      manufacturer: apiDevice.entity?.name || 'Unknown', // Using entity name as manufacturer
      model: apiDevice.model || 'N/A',
      location: apiDevice.entity?.description || 'Unknown', // Using entity description as location
      endOfLife: apiDevice.warrantyExpiration ? new Date(apiDevice.warrantyExpiration) : new Date(),
      status: apiDevice.deviceStatus || 'Active', // Using deviceStatus as status
      eligibleUpgrade: apiDevice.warrantyExpiration && new Date(apiDevice.warrantyExpiration) < new Date() ? 'Yes' : 'No',
      entityId: apiDevice.entityId || 0,
      createdAt: apiDevice.createdAt ? new Date(apiDevice.createdAt) : new Date(),
      updatedAt: apiDevice.updatedAt ? new Date(apiDevice.updatedAt) : new Date(),
    };
  }

  getDevices(entityId?: number): Observable<Device[]> {
    return this.apiService.getDevices(entityId).pipe(
      map(devices => devices.map((device: any) => this.mapDeviceFromApi(device)))
    );
  }

  getDevice(id: number): Observable<Device> {
    return this.apiService.getDevice(id).pipe(
      map(device => this.mapDeviceFromApi(device))
    );
  }

  createDevice(device: CreateDeviceDto): Observable<Device> {
    return this.apiService.createDevice(device).pipe(
      map(device => this.mapDeviceFromApi(device))
    );
  }

  updateDevice(id: number, device: UpdateDeviceDto): Observable<Device> {
    return this.apiService.updateDevice(id, device).pipe(
      map(device => this.mapDeviceFromApi(device))
    );
  }

  deleteDevice(id: number): Observable<void> {
    return this.apiService.deleteDevice(id);
  }
} 