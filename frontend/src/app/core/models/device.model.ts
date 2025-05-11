export interface Device {
  id: string;
  name: string;
  type: string;
  model: string;
  serialNumber: string;
  status: 'online' | 'offline' | 'maintenance' | 'unknown';
  lastCheckedIn: string;
  installationDate: string;
  eolDate: string;
  location: string;
  assignedTo?: string;
  notes?: string;
}

export interface DeviceStatusSummary {
  online: number;
  offline: number;
  maintenance: number;
  unknown: number;
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