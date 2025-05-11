import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';

export interface Notification {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  type: 'info' | 'warning' | 'error' | 'success';
  read: boolean;
  link?: string;
}

@Component({
  selector: 'app-recent-notifications',
  standalone: true,
  imports: [CommonModule, RouterModule, MatIconModule],
  templateUrl: './recent-notifications.component.html',
  styleUrls: ['./recent-notifications.component.scss']
})
export class RecentNotificationsComponent implements OnInit {
  @Input() notifications: Notification[] = [];
  @Input() loading = false;

  filteredNotifications: Notification[] = [];
  activeFilter: 'all' | 'unread' = 'all';
  
  ngOnInit(): void {
    this.applyFilter(this.activeFilter);
  }

  ngOnChanges(): void {
    this.applyFilter(this.activeFilter);
  }

  applyFilter(filter: 'all' | 'unread'): void {
    this.activeFilter = filter;
    
    if (filter === 'all') {
      this.filteredNotifications = [...this.notifications];
    } else {
      this.filteredNotifications = this.notifications.filter(n => !n.read);
    }
  }

  getTypeIcon(type: string): string {
    switch (type) {
      case 'info': return 'info';
      case 'warning': return 'warning';
      case 'error': return 'error';
      case 'success': return 'check_circle';
      default: return 'notifications';
    }
  }

  getTypeClass(type: string): string {
    return `notification-${type}`;
  }

  getRelativeTime(timestamp: string): string {
    const now = new Date();
    const notificationTime = new Date(timestamp);
    const diffMs = now.getTime() - notificationTime.getTime();
    
    const diffSecs = Math.floor(diffMs / 1000);
    const diffMins = Math.floor(diffSecs / 60);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);
    
    if (diffDays > 0) {
      return diffDays === 1 ? '1 day ago' : `${diffDays} days ago`;
    }
    
    if (diffHours > 0) {
      return diffHours === 1 ? '1 hour ago' : `${diffHours} hours ago`;
    }
    
    if (diffMins > 0) {
      return diffMins === 1 ? '1 minute ago' : `${diffMins} minutes ago`;
    }
    
    return 'Just now';
  }
}
