import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { DeviceStatusSummary, DeviceStatus } from '../../../../core/services/device.service';

@Component({
  selector: 'app-device-status',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './device-status.component.html',
  styleUrls: ['./device-status.component.scss']
})
export class DeviceStatusComponent {
  @Input() deviceStatus?: DeviceStatusSummary;
  @Input() loading = false;

  // Make enum accessible in the template
  DeviceStatus = DeviceStatus;

  getStatusColorClass(status: string): string {
    switch (status) {
      case DeviceStatus.Active: return 'status-good';
      case DeviceStatus.Required: return 'status-warning';
      case DeviceStatus.Retired: return 'status-inactive';
      default: return 'status-unknown';
    }
  }

  getPercentage(count: number): number {
    if (!this.deviceStatus || this.deviceStatus.total === 0) return 0;
    return (count / this.deviceStatus.total) * 100;
  }
}
