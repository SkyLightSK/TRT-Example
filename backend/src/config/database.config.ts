import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { Client } from 'pg';

export const getDatabaseConfig = async (
  configService: ConfigService
): Promise<TypeOrmModuleOptions> => {
  // Database connection details
  const host = configService.get('DB_HOST', 'localhost');
  const port = configService.get<number>('DB_PORT', 5432);
  const username = configService.get('DB_USERNAME', 'postgres');
  const password = configService.get('DB_PASSWORD', 'password');
  const database = configService.get('DB_DATABASE', 'trt_portal');
  
  // Try to create database if it doesn't exist
  const client = new Client({
    host,
    port,
    user: username,
    password,
    database: 'postgres', // Connect to default postgres database first
  });
  
  try {
    await client.connect();
    console.log('Connected to PostgreSQL server to check for database existence');
    
    // Check if database exists
    const res = await client.query(
      `SELECT datname FROM pg_catalog.pg_database WHERE datname = $1`,
      [database]
    );
    
    if (res.rowCount === 0) {
      console.log(`Database "${database}" not found, creating it...`);
      await client.query(`CREATE DATABASE "${database}"`);
      console.log(`Database "${database}" created successfully`);
    } else {
      console.log(`Database "${database}" already exists`);
    }
  } catch (error) {
    console.error('Error checking/creating database:', error.message);
    if (error.code === '28P01') {
      console.error('Authentication failed. Please check your username and password.');
    } else if (error.code === 'ECONNREFUSED') {
      console.error('Connection refused. Please check if PostgreSQL server is running.');
    }
    // Continue with application startup even if database creation fails
    // The TypeORM connection attempt will show more specific errors
  } finally {
    try {
      await client.end();
      console.log('Closed initial PostgreSQL connection');
    } catch (err) {
      console.error('Error closing PostgreSQL client:', err.message);
    }
  }
  
  // Return TypeORM config
  return {
    type: 'postgres',
    host,
    port,
    username,
    password,
    database,
    entities: [__dirname + '/../**/*.entity{.ts,.js}'],
    synchronize: configService.get('NODE_ENV') !== 'production',
    logging: configService.get('NODE_ENV') !== 'production',
  };
}; 