import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BudgetItem } from './entities/budget-item.entity';
import { BudgetsController } from './budgets.controller';
import { BudgetsService } from './budgets.service';
import { Budget } from './entities/budget.entity';
import { BudgetItemsService } from './budget-items.service';
import { Entity } from '../entities/entities/entity.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Budget, BudgetItem, Entity])],
  controllers: [BudgetsController],
  providers: [BudgetsService, BudgetItemsService],
  exports: [BudgetsService, BudgetItemsService],
})
export class BudgetsModule {} 