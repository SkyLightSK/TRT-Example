import { NestFactory } from '@nestjs/core';
import { Logger } from '@nestjs/common';
import { SeedModule } from './seed.module';
import { SeedService } from './seed.service';

const logger = new Logger('SeedRunner');

async function bootstrap() {
  const app = await NestFactory.create(SeedModule);
  const seedService = app.get(SeedService);
  
  try {
    // Check if we need to reset the database
    const args = process.argv.slice(2);
    const shouldReset = args.includes('--reset');
    
    if (shouldReset) {
      logger.log('Resetting database...');
      await seedService.reset();
    }
    
    logger.log('Starting database seeding...');
    await seedService.seed();
    logger.log('Database seeding completed successfully');
  } catch (error) {
    logger.error('Error during database seeding:');
    logger.error(error);
    process.exit(1);
  } finally {
    await app.close();
  }
}

bootstrap(); 