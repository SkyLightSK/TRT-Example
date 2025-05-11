import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { BudgetStatistics, YearlyBudgetTrend } from '../../../../core/services/budget.service';

@Component({
  selector: 'app-budget-overview',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './budget-overview.component.html',
  styleUrls: ['./budget-overview.component.scss']
})
export class BudgetOverviewComponent {
  @Input() budgetStats: BudgetStatistics | null = null;
  
  selectedYears: number[] = [];
  availableYears: number[] = [];

  ngOnChanges(): void {
    if (this.budgetStats && this.budgetStats.yearlyTrends) {
      // Set available years from trends
      this.availableYears = this.budgetStats.yearlyTrends.map(trend => trend.year);
      
      // Default to selecting all years
      this.selectedYears = [...this.availableYears];
    }
  }

  updateYearFilter(years: number[]): void {
    this.selectedYears = years;
  }
  
  toggleYearFilter(year: number): void {
    if (this.selectedYears.includes(year)) {
      this.updateYearFilter(this.selectedYears.filter(y => y !== year));
    } else {
      this.updateYearFilter([...this.selectedYears, year]);
    }
  }
  
  // Get filtered yearly trends based on selected years
  getFilteredTrends(): YearlyBudgetTrend[] {
    if (!this.budgetStats || !this.selectedYears.length) return [];
    return this.budgetStats.yearlyTrends.filter(trend => 
      this.selectedYears.includes(trend.year)
    );
  }

  // Helper methods for template
  formatCurrency(value: number): string {
    if (isNaN(value) || value === undefined) {
      return '$0.00';
    }
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value);
  }

  formatPercentage(value: number): string {
    return `${value}%`;
  }
  
  getTrendBarHeight(trend: YearlyBudgetTrend): string {
    const maxHeight = 150; // maximum bar height in pixels
    const maxBudget = this.getMaxBudgetInTrends();
    if (maxBudget === 0) return '0px';
    const height = (trend.totalBudget / maxBudget) * maxHeight;
    return `${height}px`;
  }
  
  getSpentBarHeight(trend: YearlyBudgetTrend): string {
    const maxHeight = 150; // maximum bar height in pixels
    const maxBudget = this.getMaxBudgetInTrends();
    if (maxBudget === 0) return '0px';
    const height = (trend.spentToDate / maxBudget) * maxHeight;
    return `${height}px`;
  }
  
  getMaxBudgetInTrends(): number {
    if (!this.budgetStats?.yearlyTrends.length) return 0;
    return Math.max(...this.budgetStats.yearlyTrends.map(trend => trend.totalBudget));
  }
}
