// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.

// The standard way to handle environment config in Angular
export const environment = {
  production: false,
  apiUrl: 'http://localhost:3001/api',
  authApiPath: '/auth',
  deviceApiPath: '/devices',
  budgetApiPath: '/budgets',
  entityApiPath: '/entities',
  notificationApiPath: '/notifications',
  // Server configuration
  port: 4200,
  // Other environment settings
  appName: 'TRT Portal',
  logLevel: 'debug' as const,
}; 