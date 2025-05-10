import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BudgetItem } from '../budgets/entities/budget-item.entity';
import { Budget } from '../budgets/entities/budget.entity';
import { BaseSeeder } from './base.seeder';

@Injectable()
export class BudgetItemsSeeder extends BaseSeeder<BudgetItem> {
  constructor(
    @InjectRepository(BudgetItem)
    private readonly budgetItemsRepository: Repository<BudgetItem>,
    @InjectRepository(Budget)
    private readonly budgetsRepository: Repository<Budget>,
  ) {
    super(budgetItemsRepository, 'BudgetItem');
  }

  async seed(): Promise<void> {
    this.logger.log('Seeding budget items...');
    
    // Get all budgets
    const budgets = await this.budgetsRepository.find();
    
    if (budgets.length === 0) {
      this.logger.warn('No budgets found, skipping budget items seeding');
      return;
    }
    
    // Define budget item categories and descriptions
    const budgetItems = [
      { type: 'Equipment', description: 'New POS Equipment', percentage: 0.25 },
      { type: 'Equipment', description: 'Digital Menu Boards', percentage: 0.15 },
      { type: 'Software', description: 'POS Software Licenses', percentage: 0.10 },
      { type: 'Software', description: 'Inventory Management Software', percentage: 0.05 },
      { type: 'Maintenance', description: 'Hardware Maintenance', percentage: 0.12 },
      { type: 'Maintenance', description: 'Software Maintenance', percentage: 0.08 },
      { type: 'Services', description: 'IT Support', percentage: 0.15 },
      { type: 'Services', description: 'Cloud Services', percentage: 0.10 }
    ];
    
    // Create budget items for each budget
    for (const budget of budgets) {
      for (const item of budgetItems) {
        // Calculate amount based on total budget and percentage
        const amount = Math.round((await budget.totalAmount) * item.percentage * 100) / 100;
        
        await this.createBudgetItemIfNotExists({
          description: item.description,
          amount,
          notes: `${item.type} budget for ${item.description}`,
          budget: Promise.resolve(budget)
        });
      }
    }
    
    this.logger.log('Budget items seeding completed');
  }
  
  private async createBudgetItemIfNotExists(budgetItemData: Partial<BudgetItem>): Promise<void> {
    // Check if an item with this description already exists for this budget
    const budget = await budgetItemData.budget;
    const existingItem = await this.budgetItemsRepository.findOne({ 
      where: { 
        description: budgetItemData.description,
        budget: { id: budget.id }
      }
    });
    
    if (!existingItem) {
      await this.budgetItemsRepository.save(budgetItemData);
      this.logger.log(`Created budget item: ${budgetItemData.description} for budget ${budget.name}`);
    } else {
      this.logger.log(`Budget item ${budgetItemData.description} for budget ${budget.name} already exists, skipping`);
    }
  }
  
  async delete(): Promise<void> {
    this.logger.log('Deleting budget items...');
    await this.budgetItemsRepository.clear();
    this.logger.log('Budget items deleted');
  }
} 