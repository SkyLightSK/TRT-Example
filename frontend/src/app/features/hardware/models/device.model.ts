export interface Device {
  id: number;
  nsn: string;
  type: 'Kiosk' | 'Register' | 'DMB' | 'Enclosure';
  manufacturer: string;
  model: string;
  location: string;
  endOfLife: Date;
  status: 'Active' | 'Required' | 'Retired';
  eligibleUpgrade?: string;
  entityId: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateDeviceDto {
  nsn: string;
  type: 'Kiosk' | 'Register' | 'DMB' | 'Enclosure';
  manufacturer: string;
  model: string;
  location: string;
  endOfLife: Date;
  status: 'Active' | 'Required' | 'Retired';
  eligibleUpgrade?: string;
  entityId: number;
}

export interface UpdateDeviceDto {
  nsn?: string;
  type?: 'Kiosk' | 'Register' | 'DMB' | 'Enclosure';
  manufacturer?: string;
  model?: string;
  location?: string;
  endOfLife?: Date;
  status?: 'Active' | 'Required' | 'Retired';
  eligibleUpgrade?: string;
  entityId?: number;
} 