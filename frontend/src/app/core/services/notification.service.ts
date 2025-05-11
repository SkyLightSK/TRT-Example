import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

export interface Notification {
  id: number;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'danger';
  createdAt: Date;
  isRead: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  // Since we don't have a real API endpoint for notifications yet, 
  // we'll use mock data for now
  private mockNotifications: Notification[] = [
    {
      id: 1,
      title: 'Device Maintenance Required',
      message: 'Terminal #T-1234 requires maintenance.',
      type: 'warning',
      createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
      isRead: false
    },
    {
      id: 2,
      title: 'Budget Report Available',
      message: 'Q2 budget report is now available.',
      type: 'info',
      createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
      isRead: false
    },
    {
      id: 3,
      title: 'Critical Update Required',
      message: 'Security update needed for 18 devices.',
      type: 'danger',
      createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
      isRead: false
    },
    {
      id: 4,
      title: 'New Kiosk Deployment',
      message: 'Kiosk deployment scheduled for next week.',
      type: 'info',
      createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
      isRead: true
    }
  ];

  constructor() {}

  getRecentNotifications(count: number = 3): Observable<Notification[]> {
    // Sort by date (newest first) and return the specified count
    const sortedNotifications = [...this.mockNotifications]
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .slice(0, count);
    
    return of(sortedNotifications);
  }

  getUnreadCount(): Observable<number> {
    const unreadCount = this.mockNotifications.filter(n => !n.isRead).length;
    return of(unreadCount);
  }

  markAsRead(id: number): Observable<boolean> {
    const notification = this.mockNotifications.find(n => n.id === id);
    if (notification) {
      notification.isRead = true;
      return of(true);
    }
    return of(false);
  }

  getTimeAgo(date: Date): string {
    const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
    
    let interval = Math.floor(seconds / 31536000);
    if (interval > 1) return `${interval} years ago`;
    if (interval === 1) return '1 year ago';
    
    interval = Math.floor(seconds / 2592000);
    if (interval > 1) return `${interval} months ago`;
    if (interval === 1) return '1 month ago';
    
    interval = Math.floor(seconds / 86400);
    if (interval > 1) return `${interval} days ago`;
    if (interval === 1) return '1 day ago';
    
    interval = Math.floor(seconds / 3600);
    if (interval > 1) return `${interval} hours ago`;
    if (interval === 1) return '1 hour ago';
    
    interval = Math.floor(seconds / 60);
    if (interval > 1) return `${interval} minutes ago`;
    if (interval === 1) return '1 minute ago';
    
    return 'Just now';
  }
} 