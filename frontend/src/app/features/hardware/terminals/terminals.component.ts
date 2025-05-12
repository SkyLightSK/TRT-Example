import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
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
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatPaginatorModule, MatPaginator } from '@angular/material/paginator';
import { MatSortModule, MatSort } from '@angular/material/sort';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Device, CreateDeviceDto, UpdateDeviceDto } from '../models/device.model';
import { HardwareService } from '../services/hardware.service';
import { DeviceFormComponent } from '../device-form/device-form.component';

@Component({
  selector: 'app-terminals',
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
  templateUrl: './terminals.component.html',
  styleUrls: ['./terminals.component.scss']
})
export class TerminalsComponent implements OnInit, AfterViewInit {
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

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatTable) table!: MatTable<Device>;

  constructor(
    private hardwareService: HardwareService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadTerminals();
  }

  ngAfterViewInit(): void {
    if (this.dataSource) {
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    }
  }

  loadTerminals(): void {
    this.isLoading = true;
    this.hardwareService.getDevices().subscribe({
      next: (devices) => {
        // Filter only Register type devices
        const terminals = devices.filter(device => device.deviceType === 'Register');
        this.dataSource.data = terminals;
        this.isLoading = false;
        if (this.table) {
          this.table.renderRows();
        }
      },
      error: (error) => {
        this.snackBar.open('Error loading terminals', 'Close', { duration: 3000 });
        this.isLoading = false;
      }
    });
  }

  openDeviceForm(device?: Device): void {
    const dialogRef = this.dialog.open(DeviceFormComponent, {
      width: '600px',
      data: device ? { ...device } : { deviceType: 'Register' } // Pre-select Register type for new terminals
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (device) {
          this.updateDevice(device.id, result);
        } else {
          this.createDevice({...result, deviceType: 'Register'});
        }
      }
    });
  }

  createDevice(device: CreateDeviceDto): void {
    this.hardwareService.createDevice(device).subscribe({
      next: (newDevice) => {
        const currentData = this.dataSource.data;
        this.dataSource.data = [...currentData, newDevice];
        this.snackBar.open('Terminal created successfully', 'Close', { duration: 3000 });
      },
      error: (error) => {
        this.snackBar.open('Error creating terminal', 'Close', { duration: 3000 });
      }
    });
  }

  updateDevice(id: number, device: UpdateDeviceDto): void {
    this.hardwareService.updateDevice(id, device).subscribe({
      next: (updatedDevice) => {
        const currentData = this.dataSource.data;
        const index = currentData.findIndex(d => d.id === id);
        if (index !== -1) {
          currentData[index] = updatedDevice;
          this.dataSource.data = [...currentData];
        }
        this.snackBar.open('Terminal updated successfully', 'Close', { duration: 3000 });
      },
      error: (error) => {
        this.snackBar.open('Error updating terminal', 'Close', { duration: 3000 });
      }
    });
  }

  deleteDevice(id: number): void {
    if (confirm('Are you sure you want to delete this terminal?')) {
      this.hardwareService.deleteDevice(id).subscribe({
        next: () => {
          this.dataSource.data = this.dataSource.data.filter(d => d.id !== id);
          this.snackBar.open('Terminal deleted successfully', 'Close', { duration: 3000 });
        },
        error: (error) => {
          this.snackBar.open('Error deleting terminal', 'Close', { duration: 3000 });
        }
      });
    }
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.filterValue = filterValue.trim().toLowerCase();
    this.dataSource.filter = this.filterValue;

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  loadDevices(): void {
    this.loadTerminals();
  }
} 