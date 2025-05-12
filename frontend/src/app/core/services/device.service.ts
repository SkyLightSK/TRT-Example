import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApiService } from './api.service';

export enum DeviceType {
  Kiosk = 'Kiosk',
  Register = 'Register',
  DMB = 'DMB',
  Enclosure = 'Enclosure'
}

export enum DeviceStatus {
  Active = 'Active',
  Required = 'Required',
  Retired = 'Retired'
}

export interface Device {
  id: number;
  name: string;
  serialNumber: string;
  model: string;
  deviceType: DeviceType;
  deviceStatus: DeviceStatus;
  purchaseDate?: Date | string;
  warrantyExpiration?: Date | string;
  entityId?: number;
  createdAt: Date | string;
  updatedAt: Date | string;
}

export interface DeviceStatusSummary {
  total: number;
  Active: number;
  Required: number;
  Retired: number;
}

@Injectable({
  providedIn: 'root'
})
export class DeviceService {
  constructor(private apiService: ApiService) {}

  getDevices(entityId?: number): Observable<Device[]> {
    return this.apiService.getDevices(entityId);
  }

  getDevice(id: number): Observable<Device> {
    return this.apiService.getDevice(id);
  }

  getDeviceStatusSummary(): Observable<DeviceStatusSummary> {
    return this.getDevices().pipe(
      map(devices => {
        const summary: DeviceStatusSummary = {
          total: devices.length,
          Active: 0,
          Required: 0,
          Retired: 0
        };

        devices.forEach(device => {
          // Count devices by status
          if (device.deviceStatus === DeviceStatus.Active) {
            summary.Active++;
          } else if (device.deviceStatus === DeviceStatus.Required) {
            summary.Required++;
          } else if (device.deviceStatus === DeviceStatus.Retired) {
            summary.Retired++;
          }
        });

        return summary;
      })
    );
  }

  getUpcomingWarrantyExpirationDevices(): Observable<Device[]> {
    return this.getDevices().pipe(
      map(devices => {
        const today = new Date();
        const ninetyDaysFromNow = new Date(today);
        ninetyDaysFromNow.setDate(today.getDate() + 90);

        return devices
          .filter(device => {
            if (!device.warrantyExpiration) return false;
            const warrantyExpirationDate = new Date(device.warrantyExpiration);
            return warrantyExpirationDate > today && warrantyExpirationDate <= ninetyDaysFromNow;
          })
          .sort((a, b) => {
            const dateA = a.warrantyExpiration ? new Date(a.warrantyExpiration).getTime() : 0;
            const dateB = b.warrantyExpiration ? new Date(b.warrantyExpiration).getTime() : 0;
            return dateA - dateB;
          })
          .slice(0, 5); // Get top 5 upcoming warranty expiration devices
      })
    );
  }
}