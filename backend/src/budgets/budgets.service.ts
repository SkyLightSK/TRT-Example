import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Budget } from './entities/budget.entity';
import { BudgetItem } from './entities/budget-item.entity';
import { Entity } from '../entities/entities/entity.entity';

// Define interfaces for budget statistics
export interface BudgetCategorySummary {
  name: string;
  amount: number;
  percentage: number;
}

export interface YearlyBudgetTrend {
  year: number;
  totalBudget: number;
  spentToDate: number;
  utilization: number;
}

export interface CategoryBreakdown {
  name: string;
  amount: number;
  percentage: number;
}

export interface BudgetSummary {
  id: number;
  totalBudget: number;
  spentToDate: number;
  utilization: number;
  year: number;
  name: string;
  entityName: string;
  entityId: number;
  categories: BudgetCategorySummary[];
  startDate: Date | string;
  endDate: Date | string;
  entitiesBreakdown: EntityBreakdown[];
}

export interface BudgetStatistics {
  currentBudget: BudgetSummary | null;
  yearlyTrends: YearlyBudgetTrend[];
  entityName: string;
  totalAllocated: number;
  totalSpent: number;
  overallUtilization: number;
  categoryBreakdown: CategoryBreakdown[];
  entitiesBreakdown: EntityBreakdown[];
}

export interface EntityBreakdown {
  id: number;
  name: string;
  totalBudget: number;
  spentToDate: number;
  utilization: number;
}

@Injectable()
export class BudgetsService {
  constructor(
    @InjectRepository(Budget)
    private budgetsRepository: Repository<Budget>,
    @InjectRepository(BudgetItem)
    private budgetItemsRepository: Repository<BudgetItem>,
    @InjectRepository(Entity)
    private entityRepository: Repository<Entity>,
  ) {}

  async create(createBudgetDto: Partial<Budget>): Promise<Budget> {
    const budget = this.budgetsRepository.create(createBudgetDto);
    return this.budgetsRepository.save(budget);
  }

  async findAll(fiscalYear?: number): Promise<Budget[]> {
    const queryBuilder = this.budgetsRepository.createQueryBuilder('budget')
      .leftJoinAndSelect('budget.items', 'items');
    
    if (fiscalYear) {
      queryBuilder.where('budget.fiscalYear = :fiscalYear', { fiscalYear });
    }
    
    return queryBuilder.getMany();
  }

  async findOne(id: number): Promise<Budget> {
    const budget = await this.budgetsRepository.findOne({
      where: { id },
      relations: ['items', 'items.entity', 'entity'],
    });

    if (!budget) {
      throw new NotFoundException(`Budget with ID ${id} not found`);
    }

    return budget;
  }

  async update(id: number, updateBudgetDto: Partial<Budget>): Promise<Budget> {
    const budget = await this.findOne(id);
    
    const updatedBudget = {
      ...budget,
      ...updateBudgetDto,
    };
    
    await this.budgetsRepository.save(updatedBudget);
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    const budget = await this.findOne(id);
    await this.budgetsRepository.remove(budget);
  }

  async findAllItems(): Promise<BudgetItem[]> {
    return this.budgetItemsRepository.find({ 
      relations: ['budget', 'entity'] 
    });
  }

  async findOneItem(id: number): Promise<BudgetItem> {
    const budgetItem = await this.budgetItemsRepository.findOne({ where: { id } });
    if (!budgetItem) {
      throw new NotFoundException(`Budget item with ID ${id} not found`);
    }
    return budgetItem;
  }

  async getBudgetStatistics(entityId?: number): Promise<BudgetStatistics> {
    // Step 1: Get all budgets, optionally filtered by entity
    let budgetsQuery = this.budgetsRepository.createQueryBuilder('budget')
      .leftJoinAndSelect('budget.items', 'items');
    
    // If entityId is provided, join with entity to filter
    if (entityId) {
      budgetsQuery = budgetsQuery
        .leftJoinAndSelect('budget.entity', 'entity')
        .where('entity.id = :entityId', { entityId });
    } else {
      // Always include the entity relation for name/id access
      budgetsQuery = budgetsQuery.leftJoinAndSelect('budget.entity', 'entity');
    }
    
    const budgets = await budgetsQuery.getMany();
    
    if (budgets.length === 0) {
      return this.createEmptyBudgetStatistics();
    }

    // Get all unique entity IDs (make sure entities are loaded)
    const entityIds: number[] = [];
    const entityMap = new Map<number, { id: number, name: string }>();
    
    // Load all entities upfront
    for (const budget of budgets) {
      try {
        // Entity is lazy-loaded, so we need to await it
        if (budget.entity) {
          const entity = await budget.entity;
          if (entity && entity.id) {
            entityIds.push(entity.id);
            entityMap.set(entity.id, { id: entity.id, name: entity.name });
          }
        }
      } catch (error) {
        // Skip if entity can't be loaded
        console.error('Failed to load entity for budget:', budget.id);
      }
    }
    
    // Step 2: Group budgets by year
    const budgetsByYear = new Map<number, Budget[]>();
    
    budgets.forEach(budget => {
      const year = budget.fiscalYear;
      const yearBudgets = budgetsByYear.get(year) || [];
      yearBudgets.push(budget);
      budgetsByYear.set(year, yearBudgets);
    });

    // Step 3: Calculate yearly trends
    const yearlyTrends: YearlyBudgetTrend[] = [];
    
    for (const [year, yearBudgets] of budgetsByYear.entries()) {
      const totalBudget = yearBudgets.reduce((sum, budget) => sum + Number(budget.totalAmount), 0);
      
      // For spent amount, we'll calculate based on budget items or use a simulation
      // In a real application, you would use actual transaction data
      const budgetItems = yearBudgets.flatMap(budget => budget.items || []);
      
      // For this example, we'll simulate spent amounts as 30-80% of total budget
      // with higher percentages for older years
      const currentYear = new Date().getFullYear();
      const yearDiff = currentYear - year;
      const spentRatio = Math.min(0.3 + (yearDiff * 0.15), 0.95);
      const spentToDate = totalBudget * spentRatio;
      
      const utilization = totalBudget > 0 ? (spentToDate / totalBudget) * 100 : 0;
      
      yearlyTrends.push({
        year,
        totalBudget,
        spentToDate,
        utilization: Math.round(utilization)
      });
    }
    
    // Sort trends by year
    yearlyTrends.sort((a, b) => a.year - b.year);
    
    // Step 4: Calculate category breakdown from all budget items
    const allBudgetItems = budgets.flatMap(budget => budget.items || []);
    const categoryBreakdown = this.calculateCategoryBreakdown(allBudgetItems);
    
    // Step 5: Calculate overall metrics
    const totalAllocated = budgets.reduce((sum, budget) => sum + Number(budget.totalAmount), 0);
    const totalSpent = yearlyTrends.reduce((sum, trend) => sum + trend.spentToDate, 0);
    const overallUtilization = totalAllocated > 0 ? (totalSpent / totalAllocated) * 100 : 0;
    
    // Step 6: Get entity name or use "All Entities"
    let entityName = "All Entities";
    if (entityId) {
      const entity = await this.entityRepository.findOne({ where: { id: entityId } });
      if (entity) {
        entityName = entity.name;
      }
    } else if (entityIds.length === 1) {
      // If there's only one entity in the results, use its name
      const entityData = entityMap.get(entityIds[0]);
      if (entityData) {
        entityName = entityData.name;
      }
    }
    
    // Step 7: Create current year budget summary
    const currentYear = new Date().getFullYear();
    const currentYearBudgets = budgetsByYear.get(currentYear) || [];
    let currentBudget: BudgetSummary | null = null;
    
    if (currentYearBudgets.length > 0) {
      const totalBudget = currentYearBudgets.reduce((sum, budget) => sum + Number(budget.totalAmount), 0);
      const currentYearItems = currentYearBudgets.flatMap(budget => budget.items || []);
      const categories = this.calculateCategoryBreakdown(currentYearItems);
      
      // For spent amount, we'll use the yearly trend or calculate it
      const yearTrend = yearlyTrends.find(trend => trend.year === currentYear);
      const spentToDate = yearTrend ? yearTrend.spentToDate : (totalBudget * 0.5); // Default to 50% spent
      const utilization = totalBudget > 0 ? (spentToDate / totalBudget) * 100 : 0;
      
      // Use the first budget's dates as representative
      const representativeBudget = currentYearBudgets[0];
      
      // Add entity breakdown for current year
      const entitiesBreakdown = await this.calculateEntityBreakdown(currentYearBudgets, entityMap);
      
      currentBudget = {
        id: currentYearBudgets.length === 1 ? representativeBudget.id : 0,
        totalBudget,
        spentToDate,
        utilization: Math.round(utilization),
        year: currentYear,
        name: `FY ${currentYear} Budget${currentYearBudgets.length > 1 ? ' (Aggregated)' : ''}`,
        entityName,
        entityId: entityId || 0,
        categories,
        startDate: representativeBudget.startDate,
        endDate: representativeBudget.endDate,
        entitiesBreakdown // Add entities breakdown
      };
    }
    
    // Get entity breakdown for all years
    const entitiesBreakdown = await this.calculateEntityBreakdown(budgets, entityMap);
    
    // Step 8: Return the compiled statistics
    return {
      currentBudget,
      yearlyTrends,
      entityName,
      totalAllocated,
      totalSpent,
      overallUtilization: Math.round(overallUtilization),
      categoryBreakdown,
      entitiesBreakdown // Add entities breakdown to the overall statistics
    };
  }
  
  private calculateCategoryBreakdown(items: BudgetItem[]): CategoryBreakdown[] {
    const categoryMap = new Map<string, number>();
    let totalAmount = 0;
    
    items.forEach(item => {
      // Extract category from description or use the full description
      const category = item.description.split(':')[0].trim();
      const amount = Number(item.amount);
      const currentAmount = categoryMap.get(category) || 0;
      categoryMap.set(category, currentAmount + amount);
      totalAmount += amount;
    });
    
    const categories: CategoryBreakdown[] = [];
    
    categoryMap.forEach((amount, name) => {
      categories.push({
        name,
        amount,
        percentage: totalAmount > 0 ? Math.round((amount / totalAmount) * 100) : 0
      });
    });
    
    // Sort by amount descending
    return categories.sort((a, b) => b.amount - a.amount);
  }
  
  private createEmptyBudgetStatistics(): BudgetStatistics {
    // Create sample data for demonstration purposes
    const currentYear = new Date().getFullYear();
    
    return {
      currentBudget: {
        id: 0,
        totalBudget: 500000,
        spentToDate: 275000,
        utilization: 55,
        year: currentYear,
        name: `FY ${currentYear} Budget`,
        entityName: 'Sample Entity',
        entityId: 0,
        categories: [
          { name: 'Operations', amount: 200000, percentage: 40 },
          { name: 'IT', amount: 150000, percentage: 30 },
          { name: 'Marketing', amount: 100000, percentage: 20 },
          { name: 'R&D', amount: 50000, percentage: 10 }
        ],
        startDate: new Date(`${currentYear}-01-01`),
        endDate: new Date(`${currentYear}-12-31`),
        entitiesBreakdown: [
          { id: 1, name: 'Sample Entity 1', totalBudget: 250000, spentToDate: 150000, utilization: 60 },
          { id: 2, name: 'Sample Entity 2', totalBudget: 150000, spentToDate: 75000, utilization: 50 },
          { id: 3, name: 'Sample Entity 3', totalBudget: 100000, spentToDate: 50000, utilization: 50 }
        ]
      },
      yearlyTrends: [
        { year: currentYear-3, totalBudget: 350000, spentToDate: 350000, utilization: 100 },
        { year: currentYear-2, totalBudget: 400000, spentToDate: 380000, utilization: 95 },
        { year: currentYear-1, totalBudget: 450000, spentToDate: 405000, utilization: 90 },
        { year: currentYear, totalBudget: 500000, spentToDate: 275000, utilization: 55 }
      ],
      entityName: 'All Entities',
      totalAllocated: 1700000,
      totalSpent: 1410000,
      overallUtilization: 83,
      categoryBreakdown: [
        { name: 'Operations', amount: 680000, percentage: 40 },
        { name: 'IT', amount: 510000, percentage: 30 },
        { name: 'Marketing', amount: 340000, percentage: 20 },
        { name: 'R&D', amount: 170000, percentage: 10 }
      ],
      entitiesBreakdown: [
        { id: 1, name: 'Sample Entity 1', totalBudget: 850000, spentToDate: 700000, utilization: 82 },
        { id: 2, name: 'Sample Entity 2', totalBudget: 510000, spentToDate: 440000, utilization: 86 },
        { id: 3, name: 'Sample Entity 3', totalBudget: 340000, spentToDate: 270000, utilization: 79 }
      ]
    };
  }

  // Add a new method to calculate entity breakdown
  private async calculateEntityBreakdown(budgets: Budget[], entityMap: Map<number, { id: number, name: string }>): Promise<EntityBreakdown[]> {
    const breakdownMap = new Map<number, EntityBreakdown>();
    
    // Group budgets by entity
    for (const budget of budgets) {
      try {
        // Entity is lazy-loaded, so we need to await it
        if (budget.entity) {
          const entity = await budget.entity;
          if (!entity || !entity.id) continue;
          
          const entityId = entity.id;
          const entityData = breakdownMap.get(entityId) || { 
            id: entityId, 
            name: entity.name || `Entity ${entityId}`,
            totalBudget: 0,
            spentToDate: 0,
            utilization: 0
          };
          
          entityData.totalBudget += Number(budget.totalAmount) || 0;
          breakdownMap.set(entityId, entityData);
        }
      } catch (error) {
        // Skip if entity can't be loaded
        console.error('Failed to load entity for budget in breakdown calculation:', budget.id);
      }
    }
    
    // Calculate spent amounts (simulated)
    for (const [entityId, entityData] of breakdownMap.entries()) {
      // Simulate spent amount as 30-70% of total budget
      const spentRatio = Math.random() * 0.4 + 0.3; // Between 30% and 70%
      entityData.spentToDate = entityData.totalBudget * spentRatio;
      entityData.utilization = entityData.totalBudget > 0 
        ? Math.round((entityData.spentToDate / entityData.totalBudget) * 100) 
        : 0;
    }
    
    // Convert to array and sort by budget amount
    const entityBreakdown = Array.from(breakdownMap.values());
    entityBreakdown.sort((a, b) => b.totalBudget - a.totalBudget);
    
    return entityBreakdown;
  }
} 