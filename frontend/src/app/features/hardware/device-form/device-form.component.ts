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
    
    // Log incoming data for debugging
    console.log('Device form initialized with data:', this.data);
  }

  ngOnInit(): void {
    this.initForm();
  }

  private initForm(): void {
    // Format the date properly if it exists
    let endOfLifeDate = this.data?.endOfLife;
    
    // Convert string date to Date object if needed
    if (endOfLifeDate && typeof endOfLifeDate === 'string') {
      endOfLifeDate = new Date(endOfLifeDate);
    }
    
    console.log('Initializing form with endOfLife:', endOfLifeDate);

    this.deviceForm = this.fb.group({
      nsn: [this.data?.nsn || '', [Validators.required, Validators.pattern('^[0-9]{13}$')]],
      type: [this.data?.type || 'Kiosk', Validators.required],
      manufacturer: [this.data?.manufacturer || '', Validators.required],
      model: [this.data?.model || '', Validators.required],
      location: [this.data?.location || '', Validators.required],
      endOfLife: [endOfLifeDate || this.getDefaultEndOfLife(), Validators.required],
      status: [this.data?.status || 'Active', Validators.required],
      eligibleUpgrade: [this.data?.eligibleUpgrade === 'Yes' || false],
      entityId: [this.data?.entityId || 1]
    });
    
    // Log the initial form values
    console.log('Form initialized with values:', this.deviceForm.value);
  }

  private getDefaultEndOfLife(): Date {
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
        
        // Ensure endOfLife is a Date object
        if (formValue.endOfLife) {
          if (typeof formValue.endOfLife === 'string') {
            formValue.endOfLife = new Date(formValue.endOfLife);
          }
          
          // Make sure the date is valid
          if (isNaN(formValue.endOfLife.getTime())) {
            console.error('Invalid date value:', formValue.endOfLife);
            formValue.endOfLife = this.getDefaultEndOfLife();
          }
        } else {
          formValue.endOfLife = this.getDefaultEndOfLife();
        }
        
        // Transform eligibleUpgrade from boolean to string format expected by the API
        formValue.eligibleUpgrade = formValue.eligibleUpgrade ? 'Yes' : 'No';
        
        // Ensure there's a valid entityId
        if (!formValue.entityId) {
          formValue.entityId = 1;
        }
        
        console.log('Submitting form with values:', formValue);
        
        // Use NgZone to ensure the dialog closes properly
        this.ngZone.run(() => {
          this.dialogRef.close(formValue);
        });
      } catch (error) {
        this.isSubmitting = false;
        console.error('Error preparing form data:', error);
      }
    } else {
      console.warn('Form is invalid:', this.deviceForm.errors);
      
      // Mark all fields as touched to show validation errors
      Object.keys(this.deviceForm.controls).forEach(key => {
        const control = this.deviceForm.get(key);
        control?.markAsTouched();
        if (control?.invalid) {
          console.warn(`Field ${key} is invalid:`, control.errors);
        }
      });
    }
  }

  onCancel(): void {
    this.ngZone.run(() => {
      this.dialogRef.close();
    });
  }
} 