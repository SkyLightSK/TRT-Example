import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { DeviceService, Device, DeviceStatusSummary } from '../../core/services/device.service';
import { BudgetService, BudgetSummary } from '../../core/services/budget.service';
import { NotificationService, Notification } from '../../core/services/notification.service';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  loading = true;
  budgetSummary: BudgetSummary | null = null;
  deviceStatusSummary: DeviceStatusSummary | null = null;
  recentNotifications: Notification[] = [];
  upcomingEolDevices: Device[] = [];

  constructor(
    private deviceService: DeviceService,
    private budgetService: BudgetService,
    private notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    this.loadDashboardData();
  }

  loadDashboardData(): void {
    this.loading = true;

    // Use forkJoin to wait for all API calls to complete
    forkJoin({
      budgetSummary: this.budgetService.getBudgetSummary(),
      deviceStatus: this.deviceService.getDeviceStatusSummary(),
      notifications: this.notificationService.getRecentNotifications(),
      eolDevices: this.deviceService.getUpcomingEndOfLifeDevices()
    }).subscribe({
      next: (results) => {
        this.budgetSummary = results.budgetSummary;
        this.deviceStatusSummary = results.deviceStatus;
        this.recentNotifications = results.notifications;
        this.upcomingEolDevices = results.eolDevices;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading dashboard data:', err);
        this.loading = false;
      }
    });
  }

  refreshData(): void {
    this.loadDashboardData();
  }

  // Helper methods for template
  formatCurrency(value: number): string {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value);
  }

  getTimeAgo(date: Date): string {
    return this.notificationService.getTimeAgo(date);
  }

  getDaysUntilEol(endOfLifeDate: string | Date): number {
    const eolDate = new Date(endOfLifeDate);
    const today = new Date();
    return Math.floor((eolDate.getTime() - today.getTime()) / (1000 * 3600 * 24));
  }

  getEolStatusClass(daysUntilEol: number): string {
    if (daysUntilEol <= 30) {
      return 'warning';
    } else if (daysUntilEol <= 60) {
      return 'info';
    } else {
      return 'success';
    }
  }

  formatDate(date: string | Date): string {
    const options: Intl.DateTimeFormatOptions = { month: 'short', day: 'numeric', year: 'numeric' };
    return new Date(date).toLocaleDateString('en-US', options);
  }
} 