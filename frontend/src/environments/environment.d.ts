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

// This helps with type checking when importing environment files
declare module './environment' {
  export const environment: Environment;
}

declare module './environment.prod' {
  export const environment: Environment;
}

declare module './environment.staging' {
  export const environment: Environment;
} 