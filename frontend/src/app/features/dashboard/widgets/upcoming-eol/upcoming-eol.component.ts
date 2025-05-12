import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { UpcomingEOLDevice } from '../../../../core/models/device.model';

@Component({
  selector: 'app-upcoming-eol',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './upcoming-eol.component.html',
  styleUrls: ['./upcoming-eol.component.scss']
})
export class UpcomingEolComponent {
  @Input() upcomingEolDevices: UpcomingEOLDevice[] = [];
  @Input() loading = false;

  getStatusClass(daysUntilEol: number): string {
    if (daysUntilEol <= 30) {
      return 'critical';
    } else if (daysUntilEol <= 90) {
      return 'warning';
    } else {
      return 'normal';
    }
  }

  getDeviceStatusLabel(daysUntilEol: number): string {
    if (daysUntilEol <= 30) {
      return 'Retirement Imminent';
    } else if (daysUntilEol <= 90) {
      return 'Approaching Retirement';
    } else {
      return 'Active';
    }
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }

  getDaysText(days: number): string {
    if (days === 0) {
      return 'Today';
    } else if (days === 1) {
      return '1 day';
    } else {
      return `${days} days`;
    }
  }
}
