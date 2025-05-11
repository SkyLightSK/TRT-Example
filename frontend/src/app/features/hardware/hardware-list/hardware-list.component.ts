import { Component, OnInit, ViewChild, AfterViewInit, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatTableModule, MatTable, MatTableDataSource } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDialogModule, MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatPaginatorModule, MatPaginator } from '@angular/material/paginator';
import { MatSortModule, MatSort } from '@angular/material/sort';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Device, CreateDeviceDto, UpdateDeviceDto } from '../models/device.model';
import { HardwareService } from '../services/hardware.service';
import { DeviceFormComponent } from '../device-form/device-form.component';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-hardware-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    MatFormFieldModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatDialogModule,
    MatSnackBarModule,
    MatProgressSpinnerModule,
    MatPaginatorModule,
    MatSortModule,
    MatTooltipModule
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './hardware-list.component.html',
  styleUrls: ['./hardware-list.component.scss']
})
export class HardwareListComponent implements OnInit, AfterViewInit {
  displayedColumns: string[] = [
    'name',
    'serialNumber',
    'deviceType',
    'model',
    'warrantyExpiration',
    'deviceStatus',
    'actions'
  ];
  dataSource = new MatTableDataSource<Device>([]);
  isLoading = false;
  filterValue = '';

  // Warranty warning threshold in days
  private warrantyWarningThreshold = 90; 

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatTable) table!: MatTable<Device>;

  constructor(
    private hardwareService: HardwareService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadDevices();
  }

  ngAfterViewInit(): void {
    // Wait until view is initialized to attach paginator and sort
    setTimeout(() => {
      this.setupDataSource();
    });
  }

  private setupDataSource(): void {
    if (this.dataSource) {
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      
      // Custom filter predicate to search across multiple fields
      this.dataSource.filterPredicate = (data: Device, filter: string): boolean => {
        if (!data) return false;
        
        const filterValue = filter.toLowerCase().trim();
        
        return !!(
          (data.name && data.name.toLowerCase().includes(filterValue)) || 
          (data.serialNumber && data.serialNumber.toLowerCase().includes(filterValue)) || 
          (data.deviceType && data.deviceType.toLowerCase().includes(filterValue)) || 
          (data.model && data.model.toLowerCase().includes(filterValue)) || 
          (data.deviceStatus && data.deviceStatus.toLowerCase().includes(filterValue))
        );
      };
    }
  }

  loadDevices(): void {
    this.isLoading = true;
    this.hardwareService.getDevices()
      .pipe(finalize(() => this.isLoading = false))
      .subscribe({
        next: (devices) => {
          this.dataSource.data = devices || [];
          if (this.table) {
            this.table.renderRows();
          }
          
          // Reattach paginator and sort if they might have been lost
          this.setupDataSource();
        },
        error: (error) => {
          this.snackBar.open('Error loading devices: ' + error.message, 'Close', { 
            duration: 5000,
            panelClass: 'error-snackbar'
          });
        }
      });
  }

  openDeviceForm(device?: Device): void {
    const dialogConfig: MatDialogConfig = {
      width: '700px',
      maxWidth: '95vw',
      maxHeight: '90vh',
      disableClose: true,
      autoFocus: true,
      restoreFocus: true,
      data: device ? { ...device } : null,
      panelClass: ['device-form-dialog', 'mat-elevation-z4']
    };
    
    const dialogRef = this.dialog.open(DeviceFormComponent, dialogConfig);

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (device) {
          this.updateDevice(device.id, result);
        } else {
          this.createDevice(result);
        }
      }
    });
  }

  createDevice(device: CreateDeviceDto): void {
    this.isLoading = true;
    this.hardwareService.createDevice(device)
      .pipe(finalize(() => this.isLoading = false))
      .subscribe({
        next: (newDevice) => {
          const currentData = this.dataSource.data || [];
          this.dataSource.data = [...currentData, newDevice];
          
          // Refresh table rendering
          if (this.table) {
            this.table.renderRows();
          }
          
          this.snackBar.open('Device created successfully', 'Close', { 
            duration: 3000,
            panelClass: 'success-snackbar'
          });
        },
        error: (error) => {
          this.snackBar.open('Error creating device: ' + error.message, 'Close', { 
            duration: 5000,
            panelClass: 'error-snackbar'
          });
        }
      });
  }

  updateDevice(id: number, device: UpdateDeviceDto): void {
    this.isLoading = true;
    this.hardwareService.updateDevice(id, device)
      .pipe(finalize(() => this.isLoading = false))
      .subscribe({
        next: (updatedDevice) => {
          const currentData = this.dataSource.data || [];
          const index = currentData.findIndex(d => d.id === id);
          if (index !== -1) {
            currentData[index] = updatedDevice;
            this.dataSource.data = [...currentData];
          }
          
          // Refresh table rendering
          if (this.table) {
            this.table.renderRows();
          }
          
          this.snackBar.open('Device updated successfully', 'Close', { 
            duration: 3000,
            panelClass: 'success-snackbar'
          });
        },
        error: (error) => {
          this.snackBar.open('Error updating device: ' + error.message, 'Close', { 
            duration: 5000,
            panelClass: 'error-snackbar'
          });
        }
      });
  }

  deleteDevice(id: number): void {
    const confirmDialog = this.dialog.open(DeviceDeleteConfirmComponent, {
      width: '400px',
      data: { deviceId: id },
      disableClose: true
    });

    confirmDialog.afterClosed().subscribe(confirmed => {
      if (confirmed) {
        this.isLoading = true;
        this.hardwareService.deleteDevice(id)
          .pipe(finalize(() => this.isLoading = false))
          .subscribe({
            next: () => {
              const filteredData = this.dataSource.data.filter(d => d.id !== id);
              this.dataSource.data = filteredData;
              
              // Refresh table rendering
              if (this.table) {
                this.table.renderRows();
              }
              
              this.snackBar.open('Device deleted successfully', 'Close', { 
                duration: 3000,
                panelClass: 'success-snackbar'
              });
            },
            error: (error) => {
              this.snackBar.open('Error deleting device: ' + error.message, 'Close', { 
                duration: 5000,
                panelClass: 'error-snackbar'
              });
            }
          });
      }
    });
  }

  applyFilter(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    this.filterValue = inputElement.value;
    this.dataSource.filter = this.filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  isWarrantyExpiring(device: Device): boolean {
    if (!device.warrantyExpiration) return false;
    
    const warrantyDate = new Date(device.warrantyExpiration);
    if (isNaN(warrantyDate.getTime())) return false;
    
    const today = new Date();
    const dayDiff = Math.floor((warrantyDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    
    return dayDiff >= 0 && dayDiff <= this.warrantyWarningThreshold;
  }
}

@Component({
  selector: 'app-device-delete-confirm',
  template: `
    <h2 mat-dialog-title>Confirm Delete</h2>
    <div mat-dialog-content>
      <p>Are you sure you want to delete this device? This action cannot be undone.</p>
    </div>
    <div mat-dialog-actions align="end">
      <button mat-button mat-dialog-close>Cancel</button>
      <button mat-raised-button color="warn" [mat-dialog-close]="true">Delete</button>
    </div>
  `,
  standalone: true,
  imports: [MatDialogModule, MatButtonModule]
})
export class DeviceDeleteConfirmComponent {
  constructor() {}
} 