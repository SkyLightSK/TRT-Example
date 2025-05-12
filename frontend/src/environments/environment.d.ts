export interface Environment {
  production: boolean;
  apiUrl: string;
  authApiPath: string;
  deviceApiPath: string;
  budgetApiPath: string;
  entityApiPath: string;
  notificationApiPath: string;
  port: number;
  appName: string;
  logLevel: 'debug' | 'info' | 'warn' | 'error';
}