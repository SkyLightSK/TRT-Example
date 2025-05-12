import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { Client } from 'pg';
import { Logger } from '@nestjs/common';

export const getDatabaseConfig = async (
  configService: ConfigService
): Promise<TypeOrmModuleOptions> => {
  const logger = new Logger('DatabaseConfig');
  
  // Database connection details
  const host = configService.get('DB_HOST', 'localhost');
  const port = configService.get<number>('DB_PORT', 5432);
  const username = configService.get('DB_USERNAME', 'postgres');
  const password = configService.get('DB_PASSWORD', 'password');
  const database = configService.get('DB_DATABASE', 'trt_portal');
  const nodeEnv = configService.get('NODE_ENV', 'development');
  
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
    
    // Check if database exists
    const res = await client.query(
      `SELECT datname FROM pg_catalog.pg_database WHERE datname = $1`,
      [database]
    );
    
    if (res.rowCount === 0) {
      await client.query(`CREATE DATABASE "${database}"`);
      logger.log(`Database "${database}" created`);
    }
  } catch (error) {
    if (error.code === '28P01') {
      logger.error('Authentication failed. Please check your username and password.');
    } else if (error.code === 'ECONNREFUSED') {
      logger.error('Connection refused. Please check if PostgreSQL server is running.');
    } else {
      logger.error(`Database connection error: ${error.message}`);
    }
  } finally {
    try {
      await client.end();
    } catch (err) {
      logger.error(`Error closing PostgreSQL client: ${err.message}`);
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
    synchronize: nodeEnv !== 'production',
    logging: false, // Disable SQL query logging completely
    maxQueryExecutionTime: 1000, // Log only slow queries (>1000ms)
  };
}; 