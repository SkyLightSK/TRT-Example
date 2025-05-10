import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { BudgetsModule } from './budgets/budgets.module';
import { DevicesModule } from './devices/devices.module';
import { EntitiesModule } from './entities/entities.module';
import { SeedModule } from './seeds/seed.module';
import { getDatabaseConfig } from './config/database.config';

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
    AuthModule,
    UsersModule,
    DevicesModule,
    BudgetsModule,
    EntitiesModule,
    SeedModule,
  ],
})
export class AppModule {} 