export interface Device {
  id: number;
  name: string;
  serialNumber: string;
  model: string;
  deviceType: 'Kiosk' | 'Register' | 'DMB' | 'Enclosure';
  deviceStatus: 'Active' | 'Required' | 'Retired';
  purchaseDate?: Date;
  warrantyExpiration?: Date;
  entity?: any;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateDeviceDto {
  name: string;
  serialNumber: string;
  model: string;
  deviceType: 'Kiosk' | 'Register' | 'DMB' | 'Enclosure';
  deviceStatus: 'Active' | 'Required' | 'Retired';
  purchaseDate?: Date;
  warrantyExpiration?: Date;
  entityId?: number;
}

export interface UpdateDeviceDto {
  name?: string;
  serialNumber?: string;
  model?: string;
  deviceType?: 'Kiosk' | 'Register' | 'DMB' | 'Enclosure';
  deviceStatus?: 'Active' | 'Required' | 'Retired';
  purchaseDate?: Date;
  warrantyExpiration?: Date;
  entityId?: number;
} 