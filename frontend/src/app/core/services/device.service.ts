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
  status: string;
  eligibleUpgrade: string | null;
  entityId: number;
  createdAt: Date | string;
  updatedAt: Date | string;
}

export interface DeviceStatusSummary {
  total: number;
  active: number;
  needsAttention: number;
  critical: number;
  endOfLife: number;
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
          active: 0,
          needsAttention: 0,
          critical: 0,
          endOfLife: 0
        };

        devices.forEach(device => {
          // Calculate based on device status and endOfLife date
          const endOfLifeDate = new Date(device.endOfLife);
          const today = new Date();
          const daysUntilEol = Math.floor((endOfLifeDate.getTime() - today.getTime()) / (1000 * 3600 * 24));

          if (daysUntilEol < 0) {
            summary.endOfLife++;
          } else if (daysUntilEol <= 30) {
            summary.critical++;
          } else if (daysUntilEol <= 90) {
            summary.needsAttention++;
          } else {
            summary.active++;
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
            const endOfLifeDate = new Date(device.endOfLife);
            return endOfLifeDate > today && endOfLifeDate <= ninetyDaysFromNow;
          })
          .sort((a, b) => new Date(a.endOfLife).getTime() - new Date(b.endOfLife).getTime())
          .slice(0, 5); // Get top 5 upcoming EOL devices
      })
    );
  }
} 