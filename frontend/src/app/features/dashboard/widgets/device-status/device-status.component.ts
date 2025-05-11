import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { DeviceStatusSummary } from '../../../../core/services/device.service';

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

  getStatusColorClass(status: string): string {
    switch (status) {
      case 'active': return 'status-good';
      case 'needsAttention': return 'status-warning';
      case 'critical': return 'status-critical';
      case 'endOfLife': return 'status-inactive';
      default: return 'status-unknown';
    }
  }

  getPercentage(count: number): number {
    if (!this.deviceStatus || this.deviceStatus.total === 0) return 0;
    return (count / this.deviceStatus.total) * 100;
  }
}
