import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BudgetItem } from '../budgets/entities/budget-item.entity';
import { Budget } from '../budgets/entities/budget.entity';
import { Entity } from '../entities/entities/entity.entity';
import { BaseSeeder } from './base.seeder';

@Injectable()
export class BudgetItemsSeeder extends BaseSeeder<BudgetItem> {
  constructor(
    @InjectRepository(BudgetItem)
    private readonly budgetItemsRepository: Repository<BudgetItem>,
    @InjectRepository(Budget)
    private readonly budgetsRepository: Repository<Budget>,
    @InjectRepository(Entity)
    private readonly entitiesRepository: Repository<Entity>,
  ) {
    super(budgetItemsRepository, 'BudgetItem');
  }

  async seed(): Promise<void> {
    this.logger.log('Seeding budget items...');
    
    // Find all budgets with their related entities
    const budgets = await this.budgetsRepository.find({
      relations: ['entity']
    });
    
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
      // Get entity ID from the loaded relation
      if (!budget.entity) {
        this.logger.warn(`Budget ${budget.name} (ID: ${budget.id}) has no associated entity, skipping its items`);
        continue;
      }
      
      // Load the full entity by ID to ensure we have all properties
      const entity = await this.entitiesRepository.findOne({ 
        where: { id: (budget.entity as any).id } 
      });
      
      if (!entity) {
        this.logger.warn(`Entity with ID ${(budget.entity as any).id} not found, skipping budget items for budget ${budget.name}`);
        continue;
      }
      
      this.logger.log(`Creating budget items for budget: ${budget.name} (ID: ${budget.id}) - Entity: ${entity.name} (ID: ${entity.id})`);
      
      for (const item of budgetItems) {
        // Calculate amount based on total budget and percentage
        const amount = Math.round(Number(budget.totalAmount) * item.percentage * 100) / 100;
        
        await this.createBudgetItemIfNotExists({
          description: item.description,
          amount,
          notes: `${item.type} budget for ${item.description}`,
          budget,
          entity
        });
      }
    }
    
    this.logger.log('Budget items seeding completed');
  }
  
  private async createBudgetItemIfNotExists(budgetItemData: { 
    description: string;
    amount: number;
    notes: string;
    budget: Budget;
    entity: Entity;
  }): Promise<void> {
    // Check if a similar budget item already exists
    const existingItem = await this.budgetItemsRepository.findOne({ 
      where: { 
        description: budgetItemData.description,
        budget: { id: budgetItemData.budget.id }
      }
    });
    
    if (!existingItem) {
      // Create a new budget item with direct relation references
      const budgetItem = this.budgetItemsRepository.create();
      
      // Set properties manually
      budgetItem.description = budgetItemData.description;
      budgetItem.amount = budgetItemData.amount;
      budgetItem.notes = budgetItemData.notes;
      budgetItem.budget = Promise.resolve(budgetItemData.budget);
      budgetItem.entity = Promise.resolve(budgetItemData.entity);
      
      const savedItem = await this.budgetItemsRepository.save(budgetItem);
      
      this.logger.log(`Created budget item: ${savedItem.description} (ID: ${savedItem.id}) for budget ${budgetItemData.budget.name} (ID: ${budgetItemData.budget.id}) - Entity: ${budgetItemData.entity.name} (ID: ${budgetItemData.entity.id})`);
    } else {
      this.logger.log(`Budget item ${budgetItemData.description} for budget ${budgetItemData.budget.name} already exists, skipping`);
    }
  }
  
  async delete(): Promise<void> {
    this.logger.log('Deleting budget items...');
    await this.budgetItemsRepository.clear();
    this.logger.log('Budget items deleted');
  }
} 