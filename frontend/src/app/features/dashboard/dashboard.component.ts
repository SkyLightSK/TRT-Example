import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { RouterModule } from '@angular/router';
import { forkJoin } from 'rxjs';

import { DeviceService, DeviceStatusSummary, DeviceType } from '../../core/services/device.service';
import { BudgetService } from '../../core/services/budget.service';
import { NotificationService } from '../../core/services/notification.service';
import { BudgetOverviewComponent } from './widgets/budget-overview/budget-overview.component';
import { DeviceStatusComponent } from './widgets/device-status/device-status.component';
import { RecentNotificationsComponent } from './widgets/recent-notifications/recent-notifications.component';
import { UpcomingEolComponent } from './widgets/upcoming-eol/upcoming-eol.component';
import { Notification } from './widgets/recent-notifications/recent-notifications.component';

// Interfaces for component inputs
interface UpcomingEOLDevice {
  id: string;
  name: string;
  eolDate: string;
  daysUntilEol: number;
  model: string;
  type: string;
}

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    RouterModule,
    BudgetOverviewComponent,
    DeviceStatusComponent,
    RecentNotificationsComponent,
    UpcomingEolComponent
  ]
})
export class DashboardComponent implements OnInit {
  budgetStats: any = null;
  deviceStatus: DeviceStatusSummary | undefined;
  notifications: Notification[] = [];
  upcomingEolDevices: UpcomingEOLDevice[] = [];
  
  loading = {
    budget: true,
    deviceStatus: true,
    notifications: true,
    upcomingEol: true
  };

  constructor(
    private budgetService: BudgetService,
    private deviceService: DeviceService,
    private notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    this.loadAllData();
  }

  loadAllData(): void {
    this.loadBudgetStats();
    this.loadDeviceStatus();
    this.loadNotifications();
    this.loadUpcomingEolDevices();
  }

  refreshDashboard(): void {
    this.resetLoadingState();
    this.loadAllData();
  }

  private resetLoadingState(): void {
    this.loading = {
      budget: true,
      deviceStatus: true,
      notifications: true,
      upcomingEol: true
    };
  }

  private loadBudgetStats(): void {
    this.loading.budget = true;
    this.budgetService.getBudgetStatistics().subscribe({
      next: (stats) => {
        this.budgetStats = stats;
        this.loading.budget = false;
      },
      error: (err) => {
        console.error('Error loading budget statistics', err);
        this.loading.budget = false;
      }
    });
  }

  private loadDeviceStatus(): void {
    this.loading.deviceStatus = true;
    this.deviceService.getDeviceStatusSummary().subscribe({
      next: (status) => {
        // Using the DeviceStatusSummary directly from the service
        this.deviceStatus = status;
        this.loading.deviceStatus = false;
      },
      error: (err) => {
        console.error('Error loading device status', err);
        this.loading.deviceStatus = false;
      }
    });
  }

  private loadNotifications(): void {
    this.loading.notifications = true;
    this.notificationService.getRecentNotifications().subscribe({
      next: (data) => {
        // The notification service is already providing data in the format needed by the component
        this.notifications = data;
        this.loading.notifications = false;
      },
      error: (err) => {
        console.error('Error loading notifications', err);
        this.loading.notifications = false;
      }
    });
  }

  private mapNotificationType(type: string): 'info' | 'warning' | 'error' | 'success' {
    switch(type) {
      case 'info': return 'info';
      case 'warning': return 'warning';
      case 'danger': return 'error';
      default: return 'info';
    }
  }

  private loadUpcomingEolDevices(): void {
    this.loading.upcomingEol = true;
    this.deviceService.getUpcomingWarrantyExpirationDevices().subscribe({
      next: (devices) => {
        // Map the devices to the format expected by the upcoming-eol component
        this.upcomingEolDevices = devices.map(device => {
          if (!device.warrantyExpiration) {
            return {
              id: device.id.toString(),
              name: device.name,
              eolDate: 'N/A',
              daysUntilEol: 0,
              model: device.model,
              type: device.deviceType
            };
          }
          
          const eolDate = new Date(device.warrantyExpiration);
          const today = new Date();
          const daysUntilEol = Math.floor((eolDate.getTime() - today.getTime()) / (1000 * 3600 * 24));
          
          return {
            id: device.id.toString(),
            name: device.name,
            eolDate: device.warrantyExpiration.toString(),
            daysUntilEol: daysUntilEol,
            model: device.model,
            type: device.deviceType
          };
        });
        this.loading.upcomingEol = false;
      },
      error: (err) => {
        console.error('Error loading upcoming EOL devices', err);
        this.loading.upcomingEol = false;
      }
    });
  }
} 