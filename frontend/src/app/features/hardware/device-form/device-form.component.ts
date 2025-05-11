import { Component, OnInit, inject, NgZone } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
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
    MatNativeDateModule,
    MatIconModule
  ],
  providers: [DatePipe],
  templateUrl: './device-form.component.html',
  styleUrls: ['./device-form.component.scss']
})
export class DeviceFormComponent implements OnInit {
  deviceForm!: FormGroup;
  isEditMode: boolean;
  deviceTypes = ['Kiosk', 'Register', 'DMB', 'Enclosure'];
  statusOptions = ['Active', 'Required', 'Retired'];
  minDate = new Date();
  formSubmitted = false;
  isSubmitting = false;

  dialogRef = inject(MatDialogRef<DeviceFormComponent>);
  data = inject(MAT_DIALOG_DATA) as Device | null;
  datePipe = inject(DatePipe);
  ngZone = inject(NgZone);

  constructor(private fb: FormBuilder) {
    this.isEditMode = !!this.data;
    this.minDate.setDate(this.minDate.getDate()); // Allow today's date
  }

  ngOnInit(): void {
    this.initForm();
  }

  private initForm(): void {
    // Format the date properly if it exists
    let warrantyExpiration = this.data?.warrantyExpiration;
    
    // Convert string date to Date object if needed
    if (warrantyExpiration && typeof warrantyExpiration === 'string') {
      warrantyExpiration = new Date(warrantyExpiration);
    }

    this.deviceForm = this.fb.group({
      name: [this.data?.name || '', Validators.required],
      serialNumber: [this.data?.serialNumber || '', [Validators.required, Validators.pattern('^[0-9]{13}$')]],
      deviceType: [this.data?.deviceType || 'Kiosk', Validators.required],
      model: [this.data?.model || '', Validators.required],
      purchaseDate: [this.data?.purchaseDate || new Date(), Validators.required],
      warrantyExpiration: [warrantyExpiration || this.getDefaultWarrantyExpiration(), Validators.required],
      deviceStatus: [this.data?.deviceStatus || 'Active', Validators.required],
      entityId: [this.data?.entity?.id || 1]
    });
  }

  private getDefaultWarrantyExpiration(): Date {
    const date = new Date();
    date.setFullYear(date.getFullYear() + 3); // Default 3 years from now
    return date;
  }

  // Returns whether a control is invalid and either touched or form was submitted
  isControlInvalid(controlName: string): boolean {
    const control = this.deviceForm.get(controlName);
    return !!control && control.invalid && (control.touched || this.formSubmitted);
  }

  onSubmit(): void {
    this.formSubmitted = true;
    
    if (this.deviceForm.valid) {
      this.isSubmitting = true;
      
      try {
        const formValue = { ...this.deviceForm.value };
        
        // Ensure dates are Date objects
        if (formValue.warrantyExpiration) {
          if (typeof formValue.warrantyExpiration === 'string') {
            formValue.warrantyExpiration = new Date(formValue.warrantyExpiration);
          }
          
          // Make sure the date is valid
          if (isNaN(formValue.warrantyExpiration.getTime())) {
            formValue.warrantyExpiration = this.getDefaultWarrantyExpiration();
          }
        } else {
          formValue.warrantyExpiration = this.getDefaultWarrantyExpiration();
        }
        
        if (formValue.purchaseDate) {
          if (typeof formValue.purchaseDate === 'string') {
            formValue.purchaseDate = new Date(formValue.purchaseDate);
          }
          
          if (isNaN(formValue.purchaseDate.getTime())) {
            formValue.purchaseDate = new Date();
          }
        }
        
        // Ensure there's a valid entityId
        if (!formValue.entityId) {
          formValue.entityId = 1;
        }
        
        // Use NgZone to ensure the dialog closes properly
        this.ngZone.run(() => {
          this.dialogRef.close(formValue);
        });
      } catch (error) {
        this.isSubmitting = false;
      }
    } else {
      // Mark all fields as touched to show validation errors
      Object.keys(this.deviceForm.controls).forEach(key => {
        this.deviceForm.get(key)?.markAsTouched();
      });
    }
  }

  onCancel(): void {
    this.ngZone.run(() => {
      this.dialogRef.close();
    });
  }
} 