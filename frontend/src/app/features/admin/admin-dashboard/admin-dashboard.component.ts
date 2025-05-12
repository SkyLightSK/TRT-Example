import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

interface AdminFeature {
  title: string;
  description: string;
  icon: string;
  route: string;
  color: string;
  disabled?: boolean;
}

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatIconModule, MatButtonModule, RouterModule],
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.scss']
})
export class AdminDashboardComponent {
  features: AdminFeature[] = [
    {
      title: 'User Management',
      description: 'Manage users, roles, and permissions',
      icon: 'people',
      route: '/admin/users',
      color: '#5c6bc0'
    },
    {
      title: 'Entity Management',
      description: 'Manage stores, kiosks, and other entities',
      icon: 'store',
      route: '/admin/entities',
      color: '#26a69a'
    },
    {
      title: 'System Settings',
      description: 'Configure system-wide settings and preferences',
      icon: 'settings',
      route: '/admin/settings',
      color: '#ec407a',
      disabled: true
    },
    {
      title: 'Audit Logs',
      description: 'View system activity and user actions',
      icon: 'history',
      route: '/admin/audit-logs',
      color: '#8d6e63',
      disabled: true
    }
  ];

  constructor(private router: Router) {}

  navigateTo(route: string): void {
    this.router.navigate([route]);
  }
} 