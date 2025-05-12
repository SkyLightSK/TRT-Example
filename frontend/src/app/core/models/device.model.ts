import { DeviceType, DeviceStatus } from '../services/device.service';

export interface Device {
  id: number;
  name: string;
  serialNumber: string;
  model: string;
  deviceType: DeviceType;
  deviceStatus: DeviceStatus;
  purchaseDate?: Date | string;
  warrantyExpiration?: Date | string;
  entityId?: number;
  createdAt: Date | string;
  updatedAt: Date | string;
}

export interface DeviceStatusSummary {
  Active: number;
  Required: number;
  Retired: number;
  total: number;
}

export interface UpcomingEOLDevice {
  id: string;
  name: string;
  eolDate: string;
  daysUntilEol: number;
  model: string;
  type: string;
}