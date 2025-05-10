import { Command, CommandRunner } from 'nest-commander';
import { Logger } from '@nestjs/common';
import { SeedService } from './seed.service';

@Command({
  name: 'seed',
  description: 'Seed the database with initial data',
  options: { isDefault: true }
})
export class SeedCommand extends CommandRunner {
  private readonly logger = new Logger(SeedCommand.name);

  constructor(
    private readonly seedService: SeedService
  ) {
    super();
  }

  async run(): Promise<void> {
    try {
      this.logger.log('Starting database seeding...');
      await this.seedService.seed();
      this.logger.log('Database seeding completed successfully');
    } catch (error) {
      this.logger.error('Error during database seeding');
      this.logger.error(error);
      throw error;
    }
  }
} 