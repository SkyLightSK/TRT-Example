import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface Device {
  id: number;
  nsn: string;
  type: string;
  manufacturer: string;
  model: string;
  location: string;
  endOfLife: Date | string;
  status: 'Active' | 'Required' | 'Retired';
  eligibleUpgrade: string | null;
  entityId: number;
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
  private baseUrl = 'http://localhost:3000/api/devices';

  constructor(private http: HttpClient) {}

  getDevices(): Observable<Device[]> {
    return this.http.get<Device[]>(this.baseUrl);
  }

  getDevice(id: number): Observable<Device> {
    return this.http.get<Device>(`${this.baseUrl}/${id}`);
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
          if (device.status === 'Active') {
            summary.Active++;
          } else if (device.status === 'Required') {
            summary.Required++;
          } else if (device.status === 'Retired') {
            summary.Retired++;
          }
        });

        return summary;
      })
    );
  }

  getUpcomingEndOfLifeDevices(): Observable<Device[]> {
    return this.getDevices().pipe(
      map(devices => {
        const today = new Date();
        const ninetyDaysFromNow = new Date(today);
        ninetyDaysFromNow.setDate(today.getDate() + 90);

        return devices
          .filter(device => {
            const warrantyExpirationDate = new Date(device.endOfLife);
            return warrantyExpirationDate > today && warrantyExpirationDate <= ninetyDaysFromNow;
          })
          .sort((a, b) => new Date(a.endOfLife).getTime() - new Date(b.endOfLife).getTime())
          .slice(0, 5); // Get top 5 upcoming EOL devices
      })
    );
  }
}