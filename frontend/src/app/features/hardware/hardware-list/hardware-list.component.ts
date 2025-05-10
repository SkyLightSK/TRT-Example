import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatTableModule, MatTable } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatPaginatorModule, MatPaginator } from '@angular/material/paginator';
import { MatSortModule, MatSort } from '@angular/material/sort';
import { Device, CreateDeviceDto, UpdateDeviceDto } from '../models/device.model';
import { HardwareService } from '../services/hardware.service';
import { DeviceFormComponent } from '../device-form/device-form.component';

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
    DeviceFormComponent
  ],
  templateUrl: './hardware-list.component.html',
  styleUrls: ['./hardware-list.component.scss']
})
export class HardwareListComponent implements OnInit {
  displayedColumns: string[] = [
    'nsn',
    'type',
    'manufacturer',
    'model',
    'location',
    'endOfLife',
    'status',
    'eligibleUpgrade',
    'actions'
  ];
  dataSource: Device[] = [];
  isLoading = false;
  filterValue = '';

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

  loadDevices(): void {
    this.isLoading = true;
    this.hardwareService.getDevices().subscribe({
      next: (devices) => {
        this.dataSource = devices;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading devices:', error);
        this.snackBar.open('Error loading devices', 'Close', { duration: 3000 });
        this.isLoading = false;
      }
    });
  }

  openDeviceForm(device?: Device): void {
    const dialogRef = this.dialog.open(DeviceFormComponent, {
      width: '600px',
      data: device ? { ...device } : null
    });

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
    this.hardwareService.createDevice(device).subscribe({
      next: (newDevice) => {
        this.dataSource = [...this.dataSource, newDevice];
        this.snackBar.open('Device created successfully', 'Close', { duration: 3000 });
      },
      error: (error) => {
        console.error('Error creating device:', error);
        this.snackBar.open('Error creating device', 'Close', { duration: 3000 });
      }
    });
  }

  updateDevice(id: number, device: UpdateDeviceDto): void {
    this.hardwareService.updateDevice(id, device).subscribe({
      next: (updatedDevice) => {
        const index = this.dataSource.findIndex(d => d.id === id);
        if (index !== -1) {
          this.dataSource[index] = updatedDevice;
          this.dataSource = [...this.dataSource];
        }
        this.snackBar.open('Device updated successfully', 'Close', { duration: 3000 });
      },
      error: (error) => {
        console.error('Error updating device:', error);
        this.snackBar.open('Error updating device', 'Close', { duration: 3000 });
      }
    });
  }

  deleteDevice(id: number): void {
    if (confirm('Are you sure you want to delete this device?')) {
      this.hardwareService.deleteDevice(id).subscribe({
        next: () => {
          this.dataSource = this.dataSource.filter(d => d.id !== id);
          this.snackBar.open('Device deleted successfully', 'Close', { duration: 3000 });
        },
        error: (error) => {
          console.error('Error deleting device:', error);
          this.snackBar.open('Error deleting device', 'Close', { duration: 3000 });
        }
      });
    }
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.filterValue = filterValue.trim().toLowerCase();
    // Implement filtering logic here
  }
} 