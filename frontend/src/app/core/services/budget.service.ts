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
              endDate: currentBudget.endDate
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
      endDate: new Date(`${currentYear}-12-31`)
    };
  }

  getBudgetStatistics(entityId?: number): Observable<BudgetStatistics> {
    // If no entity specified, return empty stats
    if (!entityId) {
      return of(this.createEmptyBudgetStatistics());
    }
    
    // Get entity info
    return this.apiService.getEntity(entityId).pipe(
      switchMap(entity => {
        // 1. Get all budgets
        return this.getBudgets().pipe(
          switchMap(budgets => {
            // 2. Filter by entity if provided, otherwise use all entities
            let filteredBudgets = budgets;
            if (entityId) {
              filteredBudgets = budgets.filter(budget => budget.entityId === entityId);
            }
            
            if (filteredBudgets.length === 0) {
              return of(this.createEmptyBudgetStatistics());
            }

            // 3. Sort budgets by year
            filteredBudgets.sort((a, b) => a.fiscalYear - b.fiscalYear);
            
            // Get all unique entities
            const entityIds = [...new Set(filteredBudgets.map(budget => budget.entityId))];
            
            // Get entity details for all entities (in parallel)
            return forkJoin(
              entityIds.map(id => 
                this.apiService.get<Entity>(`${this.baseUrl}${environment.entityApiPath}/${id}`).pipe(
                  catchError(() => of({ id, name: `Entity ${id}`, description: '', code: '', parentId: null }))
                )
              )
            ).pipe(
              switchMap(entities => {
                const entityMap = new Map<number, Entity>();
                entities.forEach(entity => entityMap.set(entity.id, entity));
                
                return forkJoin(
                  filteredBudgets.map(budget => 
                    this.getBudgetItems(budget.id).pipe(
                      catchError(() => of([]))
                    )
                  )
                ).pipe(
                  map(allBudgetItems => {
                    // Group budgets by year to aggregate multiple entities for the same year
                    const budgetsByYear = new Map<number, { 
                      budgets: Budget[], 
                      items: BudgetItem[][],
                      totalAmount: number
                    }>();
                    
                    filteredBudgets.forEach((budget, index) => {
                      const year = budget.fiscalYear;
                      const yearData = budgetsByYear.get(year) || { budgets: [], items: [], totalAmount: 0 };
                      yearData.budgets.push(budget);
                      yearData.items.push(allBudgetItems[index]);
                      yearData.totalAmount += Number(budget.totalAmount) || 0;
                      budgetsByYear.set(year, yearData);
                    });
                    
                    // Calculate yearly trends based on aggregated data
    // 1. Get all budgets
    return this.getBudgets().pipe(
      switchMap(budgets => {
        // 2. Filter by entity if provided, otherwise use all entities
        let filteredBudgets = budgets;
        if (entityId) {
          filteredBudgets = budgets.filter(budget => budget.entityId === entityId);
        }
        
        if (filteredBudgets.length === 0) {
          return of(this.createEmptyBudgetStatistics());
        }

        // 3. Sort budgets by year
        filteredBudgets.sort((a, b) => a.fiscalYear - b.fiscalYear);
        
        // Get all unique entities
        const entityIds = [...new Set(filteredBudgets.map(budget => budget.entityId))];
        
        // Get entity details for all entities (in parallel)
        return forkJoin(
          entityIds.map(id => 
            this.apiService.get<Entity>(`${this.baseUrl}${environment.entityApiPath}/${id}`).pipe(
              catchError(() => of({ id, name: `Entity ${id}`, description: '', code: '', parentId: null }))
            )
          )
        ).pipe(
          switchMap(entities => {
            const entityMap = new Map<number, Entity>();
            entities.forEach(entity => entityMap.set(entity.id, entity));
            
            return forkJoin(
              filteredBudgets.map(budget => 
                this.getBudgetItems(budget.id).pipe(
                  catchError(() => of([]))
                )
              )
            ).pipe(
              map(allBudgetItems => {
                // Group budgets by year to aggregate multiple entities for the same year
                const budgetsByYear = new Map<number, { 
                  budgets: Budget[], 
                  items: BudgetItem[][],
                  totalAmount: number
                }>();
                
                filteredBudgets.forEach((budget, index) => {
                  const year = budget.fiscalYear;
                  const yearData = budgetsByYear.get(year) || { budgets: [], items: [], totalAmount: 0 };
                  yearData.budgets.push(budget);
                  yearData.items.push(allBudgetItems[index]);
                  yearData.totalAmount += Number(budget.totalAmount) || 0;
                  budgetsByYear.set(year, yearData);
                });
                
                // Calculate yearly trends based on aggregated data
                const yearlyTrends: YearlyBudgetTrend[] = Array.from(budgetsByYear.entries()).map(([year, data]) => {
                  // For simplicity, we'll simulate spent amount as 30-80% of total budget
                  // with higher percentages for older years
                  const currentYear = new Date().getFullYear();
                  const spentRatio = Math.min(0.3 + (0.5 * ((year - currentYear + 3) / 5)), 0.95);
                  const spentToDate = data.totalAmount * spentRatio;
                  const utilization = (spentToDate / data.totalAmount) * 100;
                  
                  return {
                    year,
                    totalBudget: data.totalAmount,
                    spentToDate: spentToDate,
                    utilization: Math.round(utilization)
                  };
                });
                
                // Sort trends by year
                yearlyTrends.sort((a, b) => a.year - b.year);
                
                // Aggregate all budget items for category breakdown
                const categoryMap = new Map<string, number>();
                let totalAmount = 0;
                
                allBudgetItems.flat().forEach(item => {
                  if (!item) return;
                  const category = item.description.split(':')[0].trim();
                  const amount = Number(item.amount) || 0;
                  const currentAmount = categoryMap.get(category) || 0;
                  categoryMap.set(category, currentAmount + amount);
                  totalAmount += amount;
                });
                
                // Create category breakdown
                const categoryBreakdown: CategoryBreakdown[] = [];
                
                categoryMap.forEach((amount, name) => {
                  categoryBreakdown.push({
                    name,
                    amount,
                    percentage: totalAmount > 0 ? Math.round((amount / totalAmount) * 100) : 0
                  });
                });
                
                // Sort categories by amount
                categoryBreakdown.sort((a, b) => b.amount - a.amount);
                
                // Calculate overall metrics
                const totalAllocated = filteredBudgets.reduce((sum, budget) => {
                  const amount = Number(budget.totalAmount);
                  return sum + (isNaN(amount) ? 0 : amount);
                }, 0);
                
                const totalSpent = yearlyTrends.reduce((sum, trend) => {
                  const spent = Number(trend.spentToDate);
                  return sum + (isNaN(spent) ? 0 : spent);
                }, 0);
                
                const overallUtilization = totalAllocated > 0 ? Math.round((totalSpent / totalAllocated) * 100) : 0;
                
                // Get entity names for display
                let entityName = "All Entities";
                if (entityId && entityMap.has(entityId)) {
                  entityName = entityMap.get(entityId)!.name;
                } else if (entityIds.length === 1 && entityMap.has(entityIds[0])) {
                  entityName = entityMap.get(entityIds[0])!.name;
                }
                
                // Find current year budget
                const currentYear = new Date().getFullYear();
                const currentYearData = budgetsByYear.get(currentYear);
                
                let currentBudgetSummary: BudgetSummary | null = null;
                
                if (currentYearData) {
                  const categories = this.calculateCategoriesFromItems(currentYearData.items.flat());
                  const yearTrend = yearlyTrends.find(trend => trend.year === currentYear) || {
                    year: currentYear,
                    totalBudget: 0,
                    spentToDate: 0,
                    utilization: 0
                  };
                  
                  // Use the first budget's dates as representative
                  const representativeBudget = currentYearData.budgets[0];
                  
                  currentBudgetSummary = {
                    id: 0, // Not applicable for aggregated view
                    totalBudget: currentYearData.totalAmount,
                    spentToDate: yearTrend.spentToDate,
                    utilization: yearTrend.utilization,
                    year: currentYear,
                    name: `FY ${currentYear} Budget${currentYearData.budgets.length > 1 ? ' (Aggregated)' : ''}`,
                    entityName: entityName,
                    entityId: entityId || 0,
                    categories: categories,
                    startDate: representativeBudget?.startDate,
                    endDate: representativeBudget?.endDate
                  };
                }
                
                return {
                  currentBudget: currentBudgetSummary,
                  yearlyTrends: yearlyTrends,
                  entityName: entityName,
                  totalAllocated: totalAllocated,
                  totalSpent: totalSpent,
                  overallUtilization: overallUtilization,
                  categoryBreakdown: categoryBreakdown
                };
              })
            );
          })
        );
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
    return {
      currentBudget: null,
      yearlyTrends: [],
      entityName: 'Unknown',
      totalAllocated: 0,
      totalSpent: 0,
      overallUtilization: 0,
      categoryBreakdown: []
    };
  }
} 