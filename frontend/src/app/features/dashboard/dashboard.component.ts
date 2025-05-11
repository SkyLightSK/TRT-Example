import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { DeviceService, Device, DeviceStatusSummary } from '../../core/services/device.service';
import { BudgetService, BudgetStatistics, YearlyBudgetTrend } from '../../core/services/budget.service';
import { NotificationService, Notification } from '../../core/services/notification.service';
import { AuthService } from '../../core/services/auth.service';
import { forkJoin } from 'rxjs';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, MatSelectModule, FormsModule, MatButtonModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  loading = true;
  budgetStats: BudgetStatistics | null = null;
  deviceStatusSummary: DeviceStatusSummary | null = null;
  recentNotifications: Notification[] = [];
  upcomingEolDevices: Device[] = [];
  selectedYears: number[] = [];
  availableYears: number[] = [];

  constructor(
    private deviceService: DeviceService,
    private budgetService: BudgetService,
    private notificationService: NotificationService,
    public authService: AuthService
  ) {}

  ngOnInit(): void {
    this.loadDashboardData();
  }

  loadDashboardData(): void {
    this.loading = true;

    // Use forkJoin to wait for all API calls to complete
    forkJoin({
      budgetStatistics: this.budgetService.getBudgetStatistics(),
      deviceStatus: this.deviceService.getDeviceStatusSummary(),
      notifications: this.notificationService.getRecentNotifications(),
      eolDevices: this.deviceService.getUpcomingEndOfLifeDevices()
    }).subscribe({
      next: (results) => {
        this.budgetStats = results.budgetStatistics;
        this.deviceStatusSummary = results.deviceStatus;
        this.recentNotifications = results.notifications;
        this.upcomingEolDevices = results.eolDevices;
        this.loading = false;
        
        // Set available years from trends
        this.availableYears = results.budgetStatistics.yearlyTrends.map(trend => trend.year);
        
        // Default to selecting all years
        this.selectedYears = [...this.availableYears];
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

  updateYearFilter(years: number[]): void {
    this.selectedYears = years;
  }
  
  toggleYearFilter(year: number): void {
    if (this.selectedYears.includes(year)) {
      this.updateYearFilter(this.selectedYears.filter(y => y !== year));
    } else {
      this.updateYearFilter([...this.selectedYears, year]);
    }
  }
  
  // Get filtered yearly trends based on selected years
  getFilteredTrends(): YearlyBudgetTrend[] {
    if (!this.budgetStats || !this.selectedYears.length) return [];
    return this.budgetStats.yearlyTrends.filter(trend => 
      this.selectedYears.includes(trend.year)
    );
  }

  // Helper methods for template
  formatCurrency(value: number): string {
    if (isNaN(value) || value === undefined) {
      return '$0.00';
    }
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value);
  }

  formatDate(date: string | Date | undefined): string {
    if (!date) return 'N/A';
    const d = new Date(date);
    return d.toLocaleDateString();
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

  getCategoryColor(index: number): string {
    const colors = [
      '#4e73df', // Blue
      '#1cc88a', // Green
      '#36b9cc', // Teal
      '#f6c23e', // Yellow
      '#e74a3b', // Red
      '#fd7e14', // Orange
      '#6f42c1', // Purple
      '#5a5c69', // Gray
    ];
    
    return colors[index % colors.length];
  }

  isAdmin(): boolean {
    return this.authService.hasRole('ADMIN');
  }
  
  formatPercentage(value: number): string {
    return `${value}%`;
  }
  
  getTrendBarHeight(trend: YearlyBudgetTrend): string {
    const maxHeight = 150; // maximum bar height in pixels
    const maxBudget = this.getMaxBudgetInTrends();
    if (maxBudget === 0) return '0px';
    const height = (trend.totalBudget / maxBudget) * maxHeight;
    return `${height}px`;
  }
  
  getSpentBarHeight(trend: YearlyBudgetTrend): string {
    const maxHeight = 150; // maximum bar height in pixels
    const maxBudget = this.getMaxBudgetInTrends();
    if (maxBudget === 0) return '0px';
    const height = (trend.spentToDate / maxBudget) * maxHeight;
    return `${height}px`;
  }
  
  getMaxBudgetInTrends(): number {
    if (!this.budgetStats?.yearlyTrends.length) return 0;
    return Math.max(...this.budgetStats.yearlyTrends.map(trend => trend.totalBudget));
  }
} 