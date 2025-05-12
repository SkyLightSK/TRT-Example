import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { Notification } from '../../features/dashboard/widgets/recent-notifications/recent-notifications.component';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private apiUrl = `${environment.apiUrl}${environment.notificationApiPath}`;

  constructor(private http: HttpClient) {}

  getRecentNotifications(): Observable<Notification[]> {
    // Mock data - replace with actual API call
    const mockNotifications: Notification[] = [
      {
        id: '1',
        title: 'System Update Required',
        message: 'Critical security update is available for your system.',
        timestamp: new Date(Date.now() - 30 * 60000).toISOString(), // 30 minutes ago
        type: 'warning',
        read: false,
        link: '/notifications/1'
      },
      {
        id: '2',
        title: 'Budget Approved',
        message: 'Your budget request for Q2 hardware purchases has been approved.',
        timestamp: new Date(Date.now() - 2 * 3600000).toISOString(), // 2 hours ago
        type: 'success',
        read: true,
        link: '/notifications/2'
      },
      {
        id: '3',
        title: 'License Expiring',
        message: 'The license for Software X will expire in 15 days.',
        timestamp: new Date(Date.now() - 1 * 86400000).toISOString(), // 1 day ago
        type: 'info',
        read: false,
        link: '/notifications/3'
      },
      {
        id: '4',
        title: 'Device Offline',
        message: 'Server SRV-001 has been offline for more than 1 hour.',
        timestamp: new Date(Date.now() - 3 * 86400000).toISOString(), // 3 days ago
        type: 'error',
        read: true,
        link: '/notifications/4'
      }
    ];

    return of(mockNotifications).pipe(delay(500));
  }

  getNotification(id: string): Observable<Notification> {
    // Mock data - replace with actual API call
    return of({
      id,
      title: 'System Update Required',
      message: 'Critical security update is available for your system. Please schedule maintenance within the next 7 days to apply this update.',
      timestamp: new Date(Date.now() - 30 * 60000).toISOString(),
      type: 'warning' as 'warning',
      read: false,
      link: `/notifications/${id}`
    }).pipe(delay(300));
  }

  markAsRead(id: string): Observable<boolean> {
    // Mock implementation - replace with actual API call
    return of(true).pipe(delay(300));
  }
} 