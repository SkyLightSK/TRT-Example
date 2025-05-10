import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { SeedService } from './seed.service';
import { UsersSeeder } from './users.seeder';
import { EntitiesSeeder } from './entities.seeder';
import { DevicesSeeder } from './devices.seeder';
import { BudgetsSeeder } from './budgets.seeder';
import { BudgetItemsSeeder } from './budget-items.seeder';
import { SeedCommand } from './seed.command';
import { User } from '../users/entities/user.entity';
import { Entity } from '../entities/entities/entity.entity';
import { Device } from '../devices/entities/device.entity';
import { Budget } from '../budgets/entities/budget.entity';
import { BudgetItem } from '../budgets/entities/budget-item.entity';
import { getDatabaseConfig } from '../config/database.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: getDatabaseConfig,
    }),
    TypeOrmModule.forFeature([User, Entity, Device, Budget, BudgetItem]),
  ],
  providers: [
    SeedService,
    UsersSeeder,
    EntitiesSeeder,
    DevicesSeeder,
    BudgetsSeeder,
    BudgetItemsSeeder,
    SeedCommand,
  ],
  exports: [SeedService],
})
export class SeedModule {} 