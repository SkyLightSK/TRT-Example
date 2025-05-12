import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
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
import { catchError, finalize, of } from 'rxjs';

// Match the backend entity structure
interface Entity {
  id: number;
  name: string;
}

interface User {
  id: number;
  username: string;
  email: string;
  role: string;
  entities?: Entity[];
  status?: 'Active' | 'Inactive' | 'Pending';
  createdAt?: Date;
  updatedAt?: Date;
}

// DTOs for creating and updating users
interface CreateUserDto {
  username: string;
  email: string;
  password: string;
  role: string;
  entities?: number[];
}

interface UpdateUserDto {
  username?: string;
  email?: string;
  password?: string;
  role?: string;
  entities?: number[];
  status?: string;
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
  displayedColumns: string[] = ['username', 'email', 'role', 'entities', 'status', 'actions'];
  dataSource = new MatTableDataSource<User>([]);
  isLoading = false;
  filterValue = '';
  userForm: FormGroup;
  entities: Entity[] = [];

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private apiService: ApiService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private fb: FormBuilder
  ) {
    this.userForm = this.createUserForm();
  }

  ngOnInit(): void {
    this.loadUsers();
    this.loadEntities();
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  createUserForm(): FormGroup {
    return this.fb.group({
      id: [null],
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      role: ['user', Validators.required],
      entities: [[]],
      status: ['Active']
    });
  }

  loadUsers(): void {
    this.isLoading = true;
    this.apiService.get<User[]>('/users')
      .pipe(
        catchError(error => {
          console.error('Error loading users:', error);
          this.snackBar.open('Failed to load users. Please try again.', 'Close', { duration: 5000 });
          return of([]);
        }),
        finalize(() => {
          this.isLoading = false;
        })
      )
      .subscribe((users: User[]) => {
        // Map backend data to the format needed by the frontend
        const mappedUsers = users.map((user: User) => ({
          ...user,
          status: this.getUserStatus(user),
          entities: user.entities || []
        }));
        this.dataSource.data = mappedUsers;
      });
  }

  loadEntities(): void {
    this.apiService.get<Entity[]>('/entities')
      .pipe(
        catchError(error => {
          console.error('Error loading entities:', error);
          return of([]);
        })
      )
      .subscribe((entities: Entity[]) => {
        this.entities = entities;
      });
  }

  getUserStatus(user: User): 'Active' | 'Inactive' | 'Pending' {
    // Determine user status logic - this is an example and can be adjusted based on your backend
    // In a real app, the status would likely come from the backend directly
    if (user.createdAt && !user.updatedAt) {
      return 'Pending';
    }
    // You might have a specific field for this in your backend
    return 'Active';
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
    return entities && entities.length > 0
      ? entities.map(entity => entity.name).join(', ')
      : 'None';
  }

  openUserDialog(user?: User): void {
    // Create a dialog configuration
    const dialogConfig = {
      width: '500px',
      data: {
        user,
        entities: this.entities,
        form: this.userForm
      }
    };

    // Here in a real implementation, we would open the dialog
    // For example:
    // const dialogRef = this.dialog.open(UserFormDialogComponent, dialogConfig);
    // dialogRef.afterClosed().subscribe(result => {
    //   if (result) {
    //     if (user) {
    //       this.updateUser(user.id, result);
    //     } else {
    //       this.createUser(result);
    //     }
    //   }
    // });

    // For simplicity in this implementation, we'll just directly call the methods
    if (user) {
      this.prepareFormForEdit(user);
      this.updateUser(user.id, this.userForm.value);
    } else {
      this.prepareFormForCreate();
      this.createUser(this.userForm.value);
    }
  }

  prepareFormForEdit(user: User): void {
    // Fill form with user data
    this.userForm.patchValue({
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role,
      entities: user.entities?.map(e => e.id) || [],
      status: user.status || 'Active',
      // Don't set password as we don't want to update it automatically
      password: ''
    });
    // Password is optional when editing
    this.userForm.get('password')?.setValidators(null);
    this.userForm.get('password')?.updateValueAndValidity();
  }

  prepareFormForCreate(): void {
    // Reset form for new user
    this.userForm.reset({
      role: 'user',
      status: 'Active',
      entities: []
    });
    // Password is required when creating
    this.userForm.get('password')?.setValidators(Validators.required);
    this.userForm.get('password')?.updateValueAndValidity();
  }

  createUser(userData: CreateUserDto): void {
    this.isLoading = true;
    this.apiService.post<User>('/users', userData)
      .pipe(
        catchError(error => {
          console.error('Error creating user:', error);
          this.snackBar.open('Failed to create user. Please try again.', 'Close', { duration: 5000 });
          return of(null);
        }),
        finalize(() => {
          this.isLoading = false;
        })
      )
      .subscribe((result: User | null) => {
        if (result) {
          this.snackBar.open('User created successfully', 'Close', { duration: 3000 });
          this.loadUsers();
        }
      });
  }

  updateUser(id: number, userData: UpdateUserDto): void {
    this.isLoading = true;
    
    // If password is empty, remove it from the update data
    if (!userData.password) {
      delete userData.password;
    }
    
    this.apiService.patch<User>(`/users/${id}`, userData)
      .pipe(
        catchError(error => {
          console.error('Error updating user:', error);
          this.snackBar.open('Failed to update user. Please try again.', 'Close', { duration: 5000 });
          return of(null);
        }),
        finalize(() => {
          this.isLoading = false;
        })
      )
      .subscribe((result: User | null) => {
        if (result) {
          this.snackBar.open('User updated successfully', 'Close', { duration: 3000 });
          this.loadUsers();
        }
      });
  }

  openRolesDialog(user: User): void {
    // For now, we'll just update the role directly
    const newRole = user.role === 'admin' ? 'user' : 'admin';
    
    this.updateUser(user.id, { role: newRole });
  }

  confirmDelete(user: User): void {
    if (confirm(`Are you sure you want to delete user ${user.username}?`)) {
      this.deleteUser(user.id);
    }
  }

  deleteUser(id: number): void {
    this.isLoading = true;
    this.apiService.delete<void>(`/users/${id}`)
      .pipe(
        catchError(error => {
          console.error('Error deleting user:', error);
          this.snackBar.open('Failed to delete user. Please try again.', 'Close', { duration: 5000 });
          return of(null);
        }),
        finalize(() => {
          this.isLoading = false;
        })
      )
      .subscribe(result => {
        this.snackBar.open('User deleted successfully', 'Close', { duration: 3000 });
        // Remove from local data while waiting for refresh
        this.dataSource.data = this.dataSource.data.filter(u => u.id !== id);
        this.loadUsers();
      });
  }

  toggleStatus(user: User): void {
    // Toggle between Active and Inactive
    const newStatus = user.status === 'Active' ? 'Inactive' : 'Active';
    
    // In a real implementation, you'd have an endpoint to update status
    // For now, let's assume we can do this with the regular update endpoint
    this.updateUser(user.id, { status: newStatus });
  }
} 