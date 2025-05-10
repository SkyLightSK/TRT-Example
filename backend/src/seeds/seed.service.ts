import { Injectable, Logger } from '@nestjs/common';
import { UsersSeeder } from './users.seeder';
import { EntitiesSeeder } from './entities.seeder';
import { DevicesSeeder } from './devices.seeder';
import { BudgetsSeeder } from './budgets.seeder';
import { BudgetItemsSeeder } from './budget-items.seeder';
import { DataSource } from 'typeorm';

@Injectable()
export class SeedService {
  private readonly logger = new Logger(SeedService.name);

  constructor(
    private readonly usersSeeder: UsersSeeder,
    private readonly entitiesSeeder: EntitiesSeeder,
    private readonly devicesSeeder: DevicesSeeder,
    private readonly budgetsSeeder: BudgetsSeeder,
    private readonly budgetItemsSeeder: BudgetItemsSeeder,
    private readonly dataSource: DataSource,
  ) {}

  async seed(): Promise<void> {
    this.logger.log('Starting the seeding process...');
    
    // Seed in the correct order to maintain relationships
    await this.usersSeeder.seed();
    await this.entitiesSeeder.seed();
    await this.devicesSeeder.seed();
    await this.budgetsSeeder.seed();
    await this.budgetItemsSeeder.seed();
    
    this.logger.log('Seeding process completed successfully');
  }

  async reset(): Promise<void> {
    this.logger.log('Starting complete database reset...');
    
    const queryRunner = this.dataSource.createQueryRunner();
    
    try {
      await queryRunner.connect();
      await queryRunner.startTransaction();
      
      // Drop all tables and recreate schema
      this.logger.log('Dropping all database objects...');
      
      // Get all table names
      const tableQuery = await queryRunner.query(`
        SELECT tablename FROM pg_tables 
        WHERE schemaname = 'public' AND 
        tablename != 'typeorm_metadata'
      `);
      
      const tables = tableQuery.map(row => row.tablename);
      this.logger.log(`Found tables: ${tables.join(', ')}`);
      
      if (tables.length > 0) {
        // Disable foreign key checks for the session
        await queryRunner.query('SET session_replication_role = \'replica\'');
        
        // Drop each table
        for (const table of tables) {
          try {
            this.logger.log(`Truncating table: ${table}`);
            await queryRunner.query(`TRUNCATE TABLE "${table}" CASCADE`);
          } catch (error) {
            this.logger.warn(`Error truncating ${table}: ${error.message}`);
          }
        }
        
        // Reset all sequences (auto-increment IDs)
        const sequenceQuery = await queryRunner.query(`
          SELECT sequence_name FROM information_schema.sequences
          WHERE sequence_schema = 'public'
        `);
        
        const sequences = sequenceQuery.map(row => row.sequence_name);
        
        for (const sequence of sequences) {
          try {
            this.logger.log(`Resetting sequence: ${sequence}`);
            await queryRunner.query(`ALTER SEQUENCE "${sequence}" RESTART WITH 1`);
          } catch (error) {
            this.logger.warn(`Error resetting ${sequence}: ${error.message}`);
          }
        }
        
        // Re-enable foreign key checks
        await queryRunner.query('SET session_replication_role = \'origin\'');
      } else {
        this.logger.log('No tables found to reset');
      }
      
      await queryRunner.commitTransaction();
      this.logger.log('Database reset completed successfully');
    } catch (error) {
      this.logger.error('Error during database reset', error);
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }
} 