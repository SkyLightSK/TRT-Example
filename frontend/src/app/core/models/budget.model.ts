export interface Budget {
  id: string;
  year: number;
  amount: number;
  entityId?: string;
  entityName?: string;
  spent: number;
  remainingAmount?: number;
  utilization: number;
  items: BudgetItem[];
}

export interface BudgetItem {
  id: string;
  budgetId: string;
  category: string;
  amount: number;
  spent: number;
  description?: string;
}

export interface YearlyBudgetTrend {
  year: number;
  totalBudget: number;
  spentToDate: number;
  utilization: number;
}

export interface BudgetCategorySummary {
  category: string;
  amount: number;
  percentage: number;
  spent: number;
  spentPercentage: number;
}

export interface BudgetStatistics {
  totalAllocated: number;
  totalSpent: number;
  overallUtilization: number;
  yearlyTrends: YearlyBudgetTrend[];
  categories: BudgetCategorySummary[];
  entityName?: string;
}

export interface Entity {
  id: string;
  name: string;
  type: string;
} 