import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';

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

@Component({
  selector: 'app-user-form-dialog',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatCheckboxModule,
    MatIconModule,
    MatChipsModule
  ],
  template: `
    <h2 mat-dialog-title>{{ data.user ? 'Edit User' : 'Add New User' }}</h2>
    <mat-dialog-content>
      <form [formGroup]="form" class="user-form">
        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Username</mat-label>
          <input matInput formControlName="username" placeholder="Enter username" required>
          <mat-error *ngIf="form.get('username')?.hasError('required')">Username is required</mat-error>
        </mat-form-field>

        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Email</mat-label>
          <input matInput formControlName="email" placeholder="Enter email" required type="email">
          <mat-error *ngIf="form.get('email')?.hasError('required')">Email is required</mat-error>
          <mat-error *ngIf="form.get('email')?.hasError('email')">Please enter a valid email</mat-error>
        </mat-form-field>

        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Password</mat-label>
          <input matInput formControlName="password" placeholder="{{ data.user ? 'Leave blank to keep current password' : 'Enter password' }}" type="password">
          <mat-error *ngIf="form.get('password')?.hasError('required')">Password is required</mat-error>
          <mat-error *ngIf="form.get('password')?.hasError('minlength')">Password must be at least 6 characters</mat-error>
        </mat-form-field>

        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Role</mat-label>
          <mat-select formControlName="role" required>
            <mat-option value="admin">Admin</mat-option>
            <mat-option value="user">User</mat-option>
          </mat-select>
          <mat-error *ngIf="form.get('role')?.hasError('required')">Role is required</mat-error>
        </mat-form-field>

        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Entities</mat-label>
          <mat-select formControlName="entities" multiple>
            <mat-option *ngFor="let entity of data.entities" [value]="entity.id">
              {{ entity.name }}
            </mat-option>
          </mat-select>
        </mat-form-field>
      </form>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button mat-dialog-close>Cancel</button>
      <button mat-raised-button color="primary" [disabled]="form.invalid" (click)="onSubmit()">
        {{ data.user ? 'Update' : 'Create' }}
      </button>
    </mat-dialog-actions>
  `,
  styles: [`
    .user-form {
      display: flex;
      flex-direction: column;
      gap: 16px;
      min-width: 400px;
      max-width: 500px;
    }
    .full-width {
      width: 100%;
    }
    mat-dialog-content {
      padding-top: 10px;
    }
  `]
})
export class UserFormDialogComponent implements OnInit {
  form: FormGroup;

  constructor(
    public dialogRef: MatDialogRef<UserFormDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: {
      user?: User;
      entities: Entity[];
      form: FormGroup;
    }
  ) {
    this.form = data.form;
  }

  ngOnInit(): void {
    // Form is already prepared in the parent component
  }

  onSubmit(): void {
    if (this.form.valid) {
      this.dialogRef.close(this.form.value);
    }
  }
} 