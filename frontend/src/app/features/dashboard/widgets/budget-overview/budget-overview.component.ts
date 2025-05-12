import { Component, Input, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { BudgetService, BudgetStatistics, YearlyBudgetTrend } from '../../../../core/services/budget.service';

@Component({
  selector: 'app-budget-overview',
  standalone: true,
  imports: [CommonModule, RouterModule, MatIconModule],
  templateUrl: './budget-overview.component.html',
  styleUrls: ['./budget-overview.component.scss']
})
export class BudgetOverviewComponent implements OnInit, OnChanges {
  @Input() budgetStats: BudgetStatistics | null = null;
  @Input() loading = false;
  @Input() entityId?: number;
  
  selectedYears: number[] = [];
  availableYears: number[] = [];
  error: string | null = null;
  private isLoadingData = false;

  constructor(private budgetService: BudgetService) {}

  ngOnInit(): void {
    if (!this.budgetStats && !this.loading) {
      this.loadBudgetStatistics();
    } else {
      this.updateYearFiltersFromStats();
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['budgetStats'] && this.budgetStats) {
      this.updateYearFiltersFromStats();
    }
  }

  private updateYearFiltersFromStats(): void {
    if (this.budgetStats && this.budgetStats.yearlyTrends) {
      this.availableYears = this.budgetStats.yearlyTrends.map(trend => trend.year);
      
      this.selectedYears = [...this.availableYears];
    }
  }

  loadBudgetStatistics(): void {
    this.isLoadingData = true;
    this.loading = true;
    this.error = null;
    
    this.budgetService.getBudgetStatistics(this.entityId).subscribe({
      next: (data) => {
        this.budgetStats = data;
        this.updateYearFiltersFromStats();
        this.isLoadingData = false;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading budget statistics:', err);
        this.error = 'Failed to load budget data. Please try again later.';
        this.isLoadingData = false;
        this.loading = false;
      }
    });
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
  
  getFilteredTrends(): YearlyBudgetTrend[] {
    if (!this.budgetStats || !this.selectedYears.length) return [];
    return this.budgetStats.yearlyTrends.filter(trend => 
      this.selectedYears.includes(trend.year)
    );
  }

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
    const maxHeight = 150;
    const maxBudget = this.getMaxBudgetInTrends();
    if (maxBudget === 0) return '0px';
    const height = (trend.totalBudget / maxBudget) * maxHeight;
    return `${height}px`;
  }
  
  getSpentBarHeight(trend: YearlyBudgetTrend): string {
    const maxHeight = 150;
    const maxBudget = this.getMaxBudgetInTrends();
    if (maxBudget === 0) return '0px';
    const height = (trend.spentToDate / maxBudget) * maxHeight;
    return `${height}px`;
  }
  
  getMaxBudgetInTrends(): number {
    if (!this.budgetStats?.yearlyTrends.length) return 0;
    return Math.max(...this.budgetStats.yearlyTrends.map(trend => trend.totalBudget));
  }
  
  refresh(): void {
    if (!this.isLoadingData) {
      this.loadBudgetStatistics();
    }
  }
}
