import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../../core/services/api.service';

interface Device {
  id: string;
  nsn: string;
  type: 'Kiosk' | 'Register' | 'DMB' | 'Enclosure';
  manufacturer: string;
  model: string;
  location: string;
  endOfLife: Date;
  status: 'Active' | 'Required' | 'Retired';
  eligibleUpgrade?: string;
}

@Component({
  selector: 'app-hardware-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './hardware-list.component.html',
  styleUrls: ['./hardware-list.component.scss']
})
export class HardwareListComponent implements OnInit {
  devices: Device[] = [];

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    this.loadDevices();
  }

  loadDevices(): void {
    this.apiService.getDevices().subscribe({
      next: (data) => {
        this.devices = data;
      },
      error: (error) => {
        console.error('Error loading devices:', error);
        // TODO: Add proper error handling
      }
    });
  }

  onEdit(device: Device): void {
    // TODO: Implement edit functionality
    console.log('Edit device:', device);
  }

  onDelete(device: Device): void {
    // TODO: Implement delete functionality
    console.log('Delete device:', device);
  }
} 