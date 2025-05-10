import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { Device } from '../models/device.model';

@Component({
  selector: 'app-device-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule
  ],
  templateUrl: './device-form.component.html',
  styleUrls: ['./device-form.component.scss']
})
export class DeviceFormComponent implements OnInit {
  deviceForm!: FormGroup;
  isEditMode: boolean;
  statusOptions = ['Active', 'Required', 'Retired'];

  dialogRef = inject(MatDialogRef<DeviceFormComponent>);
  data = inject(MAT_DIALOG_DATA) as Device | null;

  constructor(private fb: FormBuilder) {
    this.isEditMode = !!this.data;
  }

  ngOnInit(): void {
    this.initForm();
  }

  private initForm(): void {
    this.deviceForm = this.fb.group({
      nsn: [this.data?.nsn || '', [Validators.required, Validators.pattern('^[0-9]{13}$')]],
      type: [this.data?.type || '', Validators.required],
      manufacturer: [this.data?.manufacturer || '', Validators.required],
      model: [this.data?.model || '', Validators.required],
      location: [this.data?.location || '', Validators.required],
      endOfLife: [this.data?.endOfLife || '', Validators.required],
      status: [this.data?.status || 'Active', Validators.required],
      eligibleUpgrade: [this.data?.eligibleUpgrade || false]
    });
  }

  onSubmit(): void {
    if (this.deviceForm.valid) {
      this.dialogRef.close(this.deviceForm.value);
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }
} 