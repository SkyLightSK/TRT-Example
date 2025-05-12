// Create a utility function to get port from environment variables
function getPortValue(): number {
  try {
    // We need to check if process is defined for browser compatibility
    if (typeof window !== 'undefined' && (window as any).process && (window as any).process.env) {
      const port = (window as any).process.env.PORT;
      if (port) {
        return Number(port);
      }
    }
  } catch (e) {
    console.warn('Error accessing process.env:', e);
  }
  return 80; // default port for production
}

// Production environment configuration
export const environment = {
  production: true,
  apiUrl: '/api', // Relative path for production, assuming API is served from the same domain
  authApiPath: '/auth',
  deviceApiPath: '/devices',
  budgetApiPath: '/budgets',
  entityApiPath: '/entities',
  notificationApiPath: '/notifications',
  // Server configuration
  port: 80, // Default port for production
  // Other environment settings
  appName: 'TRT Portal',
  logLevel: 'error' as const,
}; 