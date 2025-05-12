import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, forkJoin, of } from 'rxjs';
import { map, switchMap, catchError } from 'rxjs/operators';
import { ApiService } from './api.service';
import { environment } from '../../../environments/environment';

export interface Budget {
  id: number;
  name: string;
  fiscalYear: number;
  totalAmount: number;
  startDate: Date | string;
  endDate: Date | string;
  notes: string;
  entityId: number;
  createdAt: Date | string;
  updatedAt: Date | string;
  entity?: Entity;
}

export interface Entity {
  id: number;
  name: string;
  description: string;
  code: string;
  parentId: number | null;
}

export interface BudgetItem {
  id: number;
  description: string;
  amount: number;
  notes: string;
  budgetId: number;
  entityId: number;
  createdAt: Date | string;
  updatedAt: Date | string;
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
  entitiesBreakdown?: EntityBreakdown[];
}

export interface BudgetCategorySummary {
  name: string;
  amount: number;
  percentage: number;
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

export interface EntityBreakdown {
  id: number;
  name: string;
  totalBudget: number;
  spentToDate: number;
  utilization: number;
}

@Injectable({
  providedIn: 'root'
})
export class BudgetService {
  private baseUrl = environment.apiUrl;

  constructor(
    private apiService: ApiService,
    private http: HttpClient
  ) {}

  getBudgets(): Observable<Budget[]> {
    return this.apiService.getBudgets();
  }

  getBudgetItems(budgetId?: number): Observable<BudgetItem[]> {
    return this.apiService.getBudgetItems(budgetId);
  }

  getEntities(): Observable<Entity[]> {
    return this.apiService.getEntities();
  }

  getBudgetWithEntity(budgetId: number): Observable<Budget> {
    return this.apiService.getBudget(budgetId).pipe(
      switchMap(budget => {
        return this.apiService.getEntity(budget.entityId).pipe(
          map(entity => {
            return { ...budget, entity };
          }),
          catchError(() => {
            // If entity fetch fails, return budget without entity
            return of(budget);
          })
        );
      })
    );
  }

  getBudgetSummary(entityId?: number): Observable<BudgetSummary> {
    // 1. Get all budgets
    return this.getBudgets().pipe(
      switchMap(budgets => {
        // 2. Filter by entity if provided
        let filteredBudgets = budgets;
        if (entityId) {
          filteredBudgets = budgets.filter(budget => budget.entityId === entityId);
        }
        
        // 3. Find current year budget (or first one)
        const currentYear = new Date().getFullYear();
        const currentBudget = filteredBudgets.find(budget => budget.fiscalYear === currentYear) || 
                              filteredBudgets[0];
        
        if (!currentBudget) {
          return of(this.createEmptyBudgetSummary());
        }

        // 4. Get related data (entity and budget items)
        return forkJoin({
          entity: this.apiService.getEntity(currentBudget.entityId).pipe(
            catchError(() => of({ id: 0, name: 'Unknown', description: '', code: '', parentId: null }))
          ),
          budgetItems: this.getBudgetItems(currentBudget.id).pipe(
            catchError(() => of([]))
          )
        }).pipe(
          map(({ entity, budgetItems }) => {
            // 5. Generate category summaries
            const categoryMap = new Map<string, number>();
            
            budgetItems.forEach(item => {
              // Extract category from description or use the full description
              const category = item.description.split(':')[0].trim();
              const currentAmount = categoryMap.get(category) || 0;
              categoryMap.set(category, currentAmount + Number(item.amount));
            });
            
            const categories: BudgetCategorySummary[] = [];
            let totalCategorized = 0;
            
            categoryMap.forEach((amount, name) => {
              totalCategorized += amount;
              categories.push({
                name,
                amount,
                percentage: 0 // Will calculate after
              });
            });
            
            // Calculate percentages
            categories.forEach(cat => {
              cat.percentage = Math.round((cat.amount / totalCategorized) * 100);
            });
            
            // Sort by amount descending
            categories.sort((a, b) => b.amount - a.amount);
            
            // For simplicity, we'll simulate spent amount as 30-50% of total budget
            // In a real app, this would be calculated from actual transactions
            const spentRatio = Math.random() * (0.5 - 0.3) + 0.3;
            const spentToDate = currentBudget.totalAmount * spentRatio;
            const utilization = (spentToDate / currentBudget.totalAmount) * 100;

            return {
              id: currentBudget.id,
              totalBudget: currentBudget.totalAmount,
              spentToDate: spentToDate,
              utilization: Math.round(utilization),
              year: currentBudget.fiscalYear,
              name: currentBudget.name,
              entityName: entity.name,
              entityId: entity.id,
              categories: categories,
              startDate: currentBudget.startDate,
              endDate: currentBudget.endDate,
              entitiesBreakdown: []
            };
          })
        );
      })
    );
  }
  
  private createEmptyBudgetSummary(): BudgetSummary {
    const currentYear = new Date().getFullYear();
    return {
      id: 0,
      totalBudget: 0,
      spentToDate: 0,
      utilization: 0,
      year: currentYear,
      name: 'No Budget',
      entityName: 'Unknown',
      entityId: 0,
      categories: [],
      startDate: new Date(`${currentYear}-01-01`),
      endDate: new Date(`${currentYear}-12-31`),
      entitiesBreakdown: []
    };
  }

  getBudgetStatistics(entityId?: number): Observable<BudgetStatistics> {
    // Use the new API endpoint for budget statistics
    return this.apiService.getBudgetStatistics(entityId).pipe(
      catchError(error => {
        console.error('Error fetching budget statistics:', error);
        // Return sample data on error
        return of(this.createEmptyBudgetStatistics());
      })
    );
  }
  
  private calculateCategoriesFromItems(items: BudgetItem[]): BudgetCategorySummary[] {
    const categoryMap = new Map<string, number>();
    let totalAmount = 0;
    
    items.forEach(item => {
      const category = item.description.split(':')[0].trim();
      const amount = Number(item.amount);
      const currentAmount = categoryMap.get(category) || 0;
      categoryMap.set(category, currentAmount + amount);
      totalAmount += amount;
    });
    
    const categories: BudgetCategorySummary[] = [];
    
    categoryMap.forEach((amount, name) => {
      categories.push({
        name,
        amount,
        percentage: totalAmount > 0 ? Math.round((amount / totalAmount) * 100) : 0
      });
    });
    
    return categories.sort((a, b) => b.amount - a.amount);
  }
  
  private createEmptyBudgetStatistics(): BudgetStatistics {
    // Create empty data structure that honestly shows no data is available
    return {
      currentBudget: null,
      yearlyTrends: [],
      entityName: 'No Entities',
      totalAllocated: 0,
      totalSpent: 0,
      overallUtilization: 0,
      categoryBreakdown: [],
      entitiesBreakdown: []
    };
  }
}