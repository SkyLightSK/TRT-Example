export interface Device {
  id: string;
  name: string;
  type: string;
  model: string;
  serialNumber: string;
  status: 'Active' | 'Required' | 'Retired';
  lastCheckedIn: string;
  installationDate: string;
  eolDate: string;
  location: string;
  assignedTo?: string;
  notes?: string;
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