import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BudgetItem } from './entities/budget-item.entity';
import { BudgetsController } from './budgets.controller';
import { BudgetsService } from './budgets.service';
import { Budget } from './entities/budget.entity';
import { BudgetItemsService } from './budget-items.service';

@Module({
  imports: [TypeOrmModule.forFeature([Budget, BudgetItem])],
  controllers: [BudgetsController],
  providers: [BudgetsService, BudgetItemsService],
  exports: [BudgetsService, BudgetItemsService],
})
export class BudgetsModule {} 