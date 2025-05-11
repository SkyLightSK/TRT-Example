import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

export interface DeviceStatusSummary {
  online: number;
  offline: number;
  maintenance: number;
  unknown: number;
  total: number;
}

@Component({
  selector: 'app-device-status',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './device-status.component.html',
  styleUrls: ['./device-status.component.scss']
})
export class DeviceStatusComponent implements OnInit {
  @Input() deviceStatus?: DeviceStatusSummary;

  statusData: { label: string; count: number; color: string }[] = [];
  totalDevices = 0;

  ngOnInit(): void {
    this.updateDeviceStatusData();
  }

  ngOnChanges(): void {
    this.updateDeviceStatusData();
  }

  private updateDeviceStatusData(): void {
    if (!this.deviceStatus) {
      return;
    }

    this.statusData = [
      { 
        label: 'Online', 
        count: this.deviceStatus.online, 
        color: '#4caf50' 
      },
      { 
        label: 'Offline', 
        count: this.deviceStatus.offline, 
        color: '#f44336' 
      },
      { 
        label: 'Maintenance', 
        count: this.deviceStatus.maintenance, 
        color: '#ff9800' 
      },
      { 
        label: 'Unknown', 
        count: this.deviceStatus.unknown, 
        color: '#9e9e9e' 
      }
    ];

    this.totalDevices = this.statusData.reduce((sum, item) => sum + item.count, 0);
  }

  getPercentage(count: number): number {
    if (this.totalDevices === 0) return 0;
    return Math.round((count / this.totalDevices) * 100);
  }

  getStatusColor(label: string): string {
    return this.statusData.find(item => item.label === label)?.color || '#9e9e9e';
  }
}
