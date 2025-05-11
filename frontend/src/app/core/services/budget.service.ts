import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

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
  totalBudget: number;
  spentToDate: number;
  utilization: number;
  year: number;
}

@Injectable({
  providedIn: 'root'
})
export class BudgetService {
  private baseUrl = 'http://localhost:3000/api/budgets';

  constructor(private http: HttpClient) {}

  getBudgets(): Observable<Budget[]> {
    return this.http.get<Budget[]>(this.baseUrl);
  }

  getBudgetItems(): Observable<BudgetItem[]> {
    return this.http.get<BudgetItem[]>(`${this.baseUrl}/items`);
  }

  getBudgetSummary(): Observable<BudgetSummary> {
    return this.getBudgets().pipe(
      map(budgets => {
        // Find current year budget
        const currentYear = new Date().getFullYear();
        const currentBudget = budgets.find(budget => budget.fiscalYear === currentYear) || budgets[0];
        
        if (!currentBudget) {
          return {
            totalBudget: 0,
            spentToDate: 0,
            utilization: 0,
            year: currentYear
          };
        }

        // For simplicity, we'll simulate spent amount as 30-50% of total budget
        const spentToDate = currentBudget.totalAmount * Math.random() * (0.5 - 0.3) + 0.3;
        const utilization = (spentToDate / currentBudget.totalAmount) * 100;

        return {
          totalBudget: currentBudget.totalAmount,
          spentToDate: spentToDate,
          utilization: Math.round(utilization),
          year: currentBudget.fiscalYear
        };
      })
    );
  }
} 