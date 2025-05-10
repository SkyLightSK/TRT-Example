import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatPaginatorModule, MatPaginator } from '@angular/material/paginator';
import { MatSortModule, MatSort } from '@angular/material/sort';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatChipsModule } from '@angular/material/chips';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ApiService } from '../../../core/services/api.service';

interface Entity {
  id: string;
  name: string;
}

interface User {
  id: string;
  username: string;
  email: string;
  roles: string[];
  impersonableEntities: Entity[];
  status: 'Active' | 'Inactive' | 'Pending';
}

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    MatFormFieldModule,
    MatDialogModule,
    MatSnackBarModule,
    MatTooltipModule,
    MatChipsModule,
    MatMenuModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss']
})
export class UserListComponent implements OnInit {
  displayedColumns: string[] = ['username', 'email', 'roles', 'entities', 'status', 'actions'];
  dataSource = new MatTableDataSource<User>([]);
  isLoading = false;
  filterValue = '';

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private apiService: ApiService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  loadUsers(): void {
    this.isLoading = true;
    // TODO: Replace with actual API call when available
    // For now, using mock data
    setTimeout(() => {
      this.dataSource.data = [
        {
          id: '1',
          username: 'admin',
          email: 'admin@example.com',
          roles: ['Admin'],
          impersonableEntities: [
            { id: '1', name: 'Store A' },
            { id: '2', name: 'Store B' }
          ],
          status: 'Active'
        },
        {
          id: '2',
          username: 'operator',
          email: 'operator@example.com',
          roles: ['Operator'],
          impersonableEntities: [
            { id: '1', name: 'Store A' }
          ],
          status: 'Active'
        },
        {
          id: '3',
          username: 'manager',
          email: 'manager@example.com',
          roles: ['Manager', 'Viewer'],
          impersonableEntities: [
            { id: '1', name: 'Store A' },
            { id: '3', name: 'Store C' }
          ],
          status: 'Active'
        },
        {
          id: '4',
          username: 'pending_user',
          email: 'pending@example.com',
          roles: ['Viewer'],
          impersonableEntities: [],
          status: 'Pending'
        },
        {
          id: '5',
          username: 'inactive_user',
          email: 'inactive@example.com',
          roles: ['Operator'],
          impersonableEntities: [
            { id: '2', name: 'Store B' }
          ],
          status: 'Inactive'
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

  getEntityNames(entities: Entity[]): string {
    return entities.length > 0 
      ? entities.map(entity => entity.name).join(', ') 
      : 'None';
  }

  openUserDialog(user?: User): void {
    // TODO: Implement user form dialog
    console.log('Open user dialog:', user || 'new user');
    this.snackBar.open(user ? 'Edit user dialog opened' : 'Add user dialog opened', 'Close', { duration: 3000 });
  }

  openRolesDialog(user: User): void {
    // TODO: Implement roles management dialog
    console.log('Open roles dialog for user:', user);
    this.snackBar.open('Roles management dialog opened', 'Close', { duration: 3000 });
  }

  confirmDelete(user: User): void {
    if (confirm(`Are you sure you want to delete user ${user.username}?`)) {
      // TODO: Implement user deletion
      console.log('Delete user:', user);
      this.snackBar.open(`User ${user.username} deleted successfully`, 'Close', { duration: 3000 });
      
      // Mock deletion from the list
      this.dataSource.data = this.dataSource.data.filter(u => u.id !== user.id);
    }
  }

  toggleStatus(user: User): void {
    // Toggle between Active and Inactive
    const newStatus = user.status === 'Active' ? 'Inactive' : 'Active';
    
    // TODO: Implement actual API call
    console.log(`Toggle user ${user.username} status to ${newStatus}`);
    
    // Mock update in the list
    const index = this.dataSource.data.findIndex(u => u.id === user.id);
    if (index !== -1) {
      const updatedUser = { ...this.dataSource.data[index], status: newStatus as 'Active' | 'Inactive' | 'Pending' };
      const updatedData = [...this.dataSource.data];
      updatedData[index] = updatedUser;
      this.dataSource.data = updatedData;
      
      this.snackBar.open(`User ${user.username} status changed to ${newStatus}`, 'Close', { duration: 3000 });
    }
  }
} 