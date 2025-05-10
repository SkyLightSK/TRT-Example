import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatPaginatorModule, MatPaginator } from '@angular/material/paginator';
import { MatSortModule, MatSort } from '@angular/material/sort';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatTooltipModule } from '@angular/material/tooltip';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

interface AuditLog {
  id: string;
  timestamp: Date;
  user: string;
  action: string;
  module: string;
  details: string;
  ipAddress: string;
  severity: 'info' | 'warning' | 'error';
}

@Component({
  selector: 'app-audit-logs',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    MatFormFieldModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatTooltipModule,
    MatProgressSpinnerModule,
    FormsModule,
    ReactiveFormsModule
  ],
  templateUrl: './audit-logs.component.html',
  styleUrls: ['./audit-logs.component.scss']
})
export class AuditLogsComponent implements OnInit {
  displayedColumns: string[] = ['timestamp', 'user', 'action', 'module', 'details', 'ipAddress', 'severity'];
  dataSource = new MatTableDataSource<AuditLog>([]);
  isLoading = false;
  filterValue = '';

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor() {}

  ngOnInit(): void {
    this.loadAuditLogs();
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  loadAuditLogs(): void {
    this.isLoading = true;
    // Mock data for showcase
    setTimeout(() => {
      const today = new Date();
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);
      
      this.dataSource.data = [
        {
          id: '1',
          timestamp: new Date(today.setMinutes(today.getMinutes() - 5)),
          user: 'admin',
          action: 'LOGIN',
          module: 'Authentication',
          details: 'User logged in successfully',
          ipAddress: '192.168.1.100',
          severity: 'info'
        },
        {
          id: '2',
          timestamp: new Date(today.setMinutes(today.getMinutes() - 10)),
          user: 'admin',
          action: 'UPDATE',
          module: 'User Management',
          details: 'Updated user profile for "operator"',
          ipAddress: '192.168.1.100',
          severity: 'info'
        },
        {
          id: '3',
          timestamp: new Date(today.setMinutes(today.getMinutes() - 15)),
          user: 'operator',
          action: 'CREATE',
          module: 'Device Management',
          details: 'Created new device "Kiosk-1234"',
          ipAddress: '192.168.1.101',
          severity: 'info'
        },
        {
          id: '4',
          timestamp: new Date(today.setMinutes(today.getMinutes() - 30)),
          user: 'system',
          action: 'BACKUP',
          module: 'System',
          details: 'Automatic database backup completed',
          ipAddress: '127.0.0.1',
          severity: 'info'
        },
        {
          id: '5',
          timestamp: yesterday,
          user: 'admin',
          action: 'DELETE',
          module: 'Entity Management',
          details: 'Deleted entity "Store #5678"',
          ipAddress: '192.168.1.100',
          severity: 'warning'
        },
        {
          id: '6',
          timestamp: yesterday,
          user: 'unknown',
          action: 'FAILED_LOGIN',
          module: 'Authentication',
          details: 'Failed login attempt for user "admin"',
          ipAddress: '203.0.113.1',
          severity: 'error'
        },
        {
          id: '7',
          timestamp: yesterday,
          user: 'system',
          action: 'MAINTENANCE',
          module: 'System',
          details: 'Entered maintenance mode',
          ipAddress: '127.0.0.1',
          severity: 'info'
        }
      ];
      this.isLoading = false;
    }, 500);
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.filterValue = filterValue.trim().toLowerCase();
    this.dataSource.filter = this.filterValue;

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  exportLogs(): void {
    console.log('Export logs functionality would be implemented here');
    // In a real implementation, this would generate a CSV or PDF file
  }
} 