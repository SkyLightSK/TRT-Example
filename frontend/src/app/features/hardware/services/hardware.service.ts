import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from '../../../core/services/api.service';
import { Device, CreateDeviceDto, UpdateDeviceDto } from '../models/device.model';

@Injectable({
  providedIn: 'root'
})
export class HardwareService {
  constructor(private apiService: ApiService) {}

  getDevices(entityId?: number): Observable<Device[]> {
    return this.apiService.getDevices(entityId);
  }

  getDevice(id: number): Observable<Device> {
    return this.apiService.getDevice(id);
  }

  createDevice(device: CreateDeviceDto): Observable<Device> {
    return this.apiService.createDevice(device);
  }

  updateDevice(id: number, device: UpdateDeviceDto): Observable<Device> {
    return this.apiService.updateDevice(id, device);
  }

  deleteDevice(id: number): Observable<void> {
    return this.apiService.deleteDevice(id);
  }
} 