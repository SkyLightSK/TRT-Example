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
import { UserFormDialogComponent } from './user-form-dialog.component';

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
    MatProgressSpinnerModule,
    UserFormDialogComponent
  ],
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss']
})
export class UserListComponent implements OnInit {
  displayedColumns: string[] = ['username', 'email', 'role', 'entities', 'actions'];
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
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      role: ['user', Validators.required],
      entities: [[]]
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
    // Prepare the form based on whether we're editing or creating
    if (user) {
      this.prepareFormForEdit(user);
    } else {
      this.prepareFormForCreate();
    }

    // Create a dialog configuration
    const dialogConfig = {
      width: '500px',
      data: {
        user,
        entities: this.entities,
        form: this.userForm
      }
    };

    // Open the dialog
    const dialogRef = this.dialog.open(UserFormDialogComponent, dialogConfig);
    
    // Handle the dialog result
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (user) {
          this.updateUser(user.id, result);
        } else {
          this.createUser(result);
        }
      }
    });
  }

  prepareFormForEdit(user: User): void {
    // Fill form with user data
    this.userForm.patchValue({
      username: user.username,
      email: user.email,
      role: user.role,
      entities: user.entities?.map(e => e.id) || [],
      // Don't set password as we don't want to update it automatically
      password: ''
    });
    // Password is optional when editing
    this.userForm.get('password')?.setValidators(Validators.minLength(6));
    this.userForm.get('password')?.updateValueAndValidity();
  }

  prepareFormForCreate(): void {
    // Reset form for new user
    this.userForm.reset({
      role: 'user',
      entities: []
    });
    // Password is required when creating and must be at least 6 characters
    this.userForm.get('password')?.setValidators([Validators.required, Validators.minLength(6)]);
    this.userForm.get('password')?.updateValueAndValidity();
  }

  createUser(userData: CreateUserDto): void {
    this.isLoading = true;
    
    // Remove properties that shouldn't be sent to the backend
    const userDataToSend = {
      username: userData.username,
      email: userData.email,
      password: userData.password,
      role: userData.role
    };
    
    this.apiService.post<User>('/users', userDataToSend)
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
    
    // Create a clean object with only valid properties for the backend
    const userDataToSend: any = {};
    
    // Only include properties that are defined and should be sent to the backend
    if (userData.username) userDataToSend.username = userData.username;
    if (userData.email) userDataToSend.email = userData.email;
    if (userData.password) userDataToSend.password = userData.password;
    if (userData.role) userDataToSend.role = userData.role;
    
    this.apiService.patch<User>(`/users/${id}`, userDataToSend)
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
} 