import { z } from 'zod';

// Define environment schema with validation
export const envSchema = z.object({
  // Node environment
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  
  // Server settings
  PORT: z.coerce.number().positive().default(3000),
  API_PREFIX: z.string().default('api'),
  
  // Database configuration
  DB_HOST: z.string().default('localhost'),
  DB_PORT: z.coerce.number().positive().default(5432),
  DB_USERNAME: z.string().default('postgres'),
  DB_PASSWORD: z.string().default('password'),
  DB_DATABASE: z.string().default('trt_portal'),
  
  // JWT settings
  JWT_SECRET: z.string().min(1),
  JWT_EXPIRES_IN: z.string().default('1d'),
  
  // CORS settings
  CORS_ORIGIN: z.string().default('*'),
});

// Extract the inferred type from the schema
export type EnvConfig = z.infer<typeof envSchema>;

// Function to validate and load environment variables
export const validateEnv = (): EnvConfig => {
  try {
    // Parse and validate environment variables
    return envSchema.parse(process.env);
  } catch (error) {
    console.error('❌ Invalid environment variables:', error.format());
    process.exit(1);
  }
}; 