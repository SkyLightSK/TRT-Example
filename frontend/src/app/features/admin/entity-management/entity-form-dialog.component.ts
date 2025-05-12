import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

interface Entity {
  id: number;
  name: string;
  description: string;
  code: string;
  parentId: number | null;
}

@Component({
  selector: 'app-entity-form-dialog',
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
    MatIconModule
  ],
  template: `
    <h2 mat-dialog-title>{{ data.entity ? 'Edit Entity' : 'Add New Entity' }}</h2>
    <mat-dialog-content>
      <form [formGroup]="form" class="entity-form">
        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Name</mat-label>
          <input matInput formControlName="name" placeholder="Enter entity name" required>
          <mat-error *ngIf="form.get('name')?.hasError('required')">Name is required</mat-error>
        </mat-form-field>

        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Description</mat-label>
          <textarea matInput formControlName="description" placeholder="Enter description" rows="3"></textarea>
        </mat-form-field>

        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Code</mat-label>
          <input matInput formControlName="code" placeholder="Enter entity code" required>
          <mat-error *ngIf="form.get('code')?.hasError('required')">Code is required</mat-error>
        </mat-form-field>

        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Parent Entity</mat-label>
          <mat-select formControlName="parentId">
            <mat-option [value]="null">None (Top Level)</mat-option>
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
        {{ data.entity ? 'Update' : 'Create' }}
      </button>
    </mat-dialog-actions>
  `,
  styles: [`
    .entity-form {
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
export class EntityFormDialogComponent implements OnInit {
  form: FormGroup;

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<EntityFormDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: {
      entity?: Entity;
      entities: Entity[];
    }
  ) {
    this.form = this.createForm();
  }

  ngOnInit(): void {
    if (this.data.entity) {
      this.form.patchValue({
        name: this.data.entity.name,
        description: this.data.entity.description,
        code: this.data.entity.code,
        parentId: this.data.entity.parentId
      });
    }
  }

  createForm(): FormGroup {
    return this.fb.group({
      name: ['', Validators.required],
      description: [''],
      code: ['', Validators.required],
      parentId: [null]
    });
  }

  onSubmit(): void {
    if (this.form.valid) {
      this.dialogRef.close(this.form.value);
    }
  }
} 