import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Budget } from '../budgets/entities/budget.entity';
import { Entity } from '../entities/entities/entity.entity';
import { BaseSeeder } from './base.seeder';

@Injectable()
export class BudgetsSeeder extends BaseSeeder<Budget> {
  constructor(
    @InjectRepository(Budget)
    private readonly budgetsRepository: Repository<Budget>,
    @InjectRepository(Entity)
    private readonly entitiesRepository: Repository<Entity>,
  ) {
    super(budgetsRepository, 'Budget');
  }

  async seed(): Promise<void> {
    this.logger.log('Seeding budgets...');
    
    // Get all parent entities (owners/operators with parentId null)
    const parentEntities = await this.entitiesRepository.find({
      where: { parentId: null }
    });
    
    if (parentEntities.length === 0) {
      this.logger.warn('No parent entities found, skipping budget seeding');
      return;
    }
    
    // Current year and next year
    const currentYear = new Date().getFullYear();
    
    // Create budgets for each parent entity
    for (const entity of parentEntities) {
      // Current year budget - $500,000
      await this.createBudgetIfNotExists({
        name: `${entity.name} ${currentYear} Budget`,
        fiscalYear: currentYear,
        startDate: new Date(`${currentYear}-01-01`),
        endDate: new Date(`${currentYear}-12-31`),
        totalAmount: 500000, // $500,000
        notes: `Annual technology budget for ${entity.name} for ${currentYear}`,
        entity: Promise.resolve(entity)
      });
      
      // Next year budget - $550,000 (10% increase)
      await this.createBudgetIfNotExists({
        name: `${entity.name} ${currentYear + 1} Budget`,
        fiscalYear: currentYear + 1,
        startDate: new Date(`${currentYear + 1}-01-01`),
        endDate: new Date(`${currentYear + 1}-12-31`),
        totalAmount: 550000, // $550,000
        notes: `Annual technology budget for ${entity.name} for ${currentYear + 1}`,
        entity: Promise.resolve(entity)
      });
    }
    
    this.logger.log('Budgets seeding completed');
  }
  
  private async createBudgetIfNotExists(budgetData: Partial<Budget>): Promise<void> {
    const existingBudget = await this.budgetsRepository.findOne({ 
      where: { 
        name: budgetData.name,
        fiscalYear: budgetData.fiscalYear
      } 
    });
    
    if (!existingBudget) {
      await this.budgetsRepository.save(budgetData);
      this.logger.log(`Created budget: ${budgetData.name}`);
    } else {
      this.logger.log(`Budget ${budgetData.name} already exists, skipping`);
    }
  }
  
  async delete(): Promise<void> {
    this.logger.log('Deleting budgets...');
    await this.budgetsRepository.clear();
    this.logger.log('Budgets deleted');
  }
} 