import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    RouterModule
  ],
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.scss']
})
export class AdminDashboardComponent {
  adminModules = [
    {
      title: 'User Management',
      description: 'Add, edit, or delete users. Manage user roles and permissions.',
      icon: 'people',
      route: '/admin/users',
      color: '#4285F4'
    },
    {
      title: 'Entity Management',
      description: 'Manage entity hierarchies, add new locations, and edit details.',
      icon: 'business',
      route: '/admin/entities',
      color: '#34A853'
    },
    {
      title: 'System Settings',
      description: 'Configure system-wide settings and preferences.',
      icon: 'settings',
      route: '/admin/settings',
      color: '#FBBC05'
    },
    {
      title: 'Audit Logs',
      description: 'View system activity and user action logs.',
      icon: 'receipt',
      route: '/admin/logs',
      color: '#EA4335'
    }
  ];
} 