// Staging environment configuration
export const environment = {
  production: false,
  apiUrl: 'https://staging-api.example.com/api',
  authApiPath: '/auth',
  deviceApiPath: '/devices',
  budgetApiPath: '/budgets',
  entityApiPath: '/entities',
  notificationApiPath: '/notifications',
  // Server configuration
  port: 8080, // Staging port
  // Other environment settings
  appName: 'TRT Portal (Staging)',
  logLevel: 'info' as const,
}; 