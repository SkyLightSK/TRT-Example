import { Component, Input, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { BudgetService, BudgetStatistics, YearlyBudgetTrend } from '../../../../core/services/budget.service';

/**
 * Budget Overview Component
 * 
 * This component displays a comprehensive overview of budget statistics across all entities
 * or for a specific entity if entityId is provided. It visualizes:
 * - Overall budget metrics (total allocated, spent, utilization)
 * - Breakdown by entity
 * - Yearly trends with interactive filtering
 * 
 * Calculation methodology:
 * - Total allocated: Sum of all budgets across selected entities and years
 * - Total spent: Sum of all recorded expenses against these budgets
 * - Utilization: (Total spent / Total allocated) * 100
 * - Entity breakdown: Individual entity contributions to the overall budget
 * - Yearly trends: Budget performance over time, showing allocation vs. spending
 */
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
  showCalculationInfo = false;
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

  /**
   * Updates the year filter options based on available data
   * Extracts unique years from the yearly trends data and sets them as available filter options
   * Initially selects all available years
   */
  private updateYearFiltersFromStats(): void {
    if (this.budgetStats && this.budgetStats.yearlyTrends) {
      this.availableYears = this.budgetStats.yearlyTrends.map(trend => trend.year);
      
      this.selectedYears = [...this.availableYears];
    }
  }

  /**
   * Loads budget statistics from the service
   * - For a specific entity if entityId is provided
   * - For all entities if no entityId is provided
   * 
   * The data is fetched from the backend which compiles:
   * - Current year budget summary
   * - Historical yearly trends
   * - Entity-specific breakdowns
   * - Category allocations
   */
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

  /**
   * Updates the year filter with a new selection
   * @param years Array of selected years
   */
  updateYearFilter(years: number[]): void {
    this.selectedYears = years;
  }
  
  /**
   * Toggles a specific year in the filter selection
   * - Removes the year if already selected
   * - Adds the year if not already selected
   * 
   * @param year The year to toggle
   */
  toggleYearFilter(year: number): void {
    if (this.selectedYears.includes(year)) {
      this.updateYearFilter(this.selectedYears.filter(y => y !== year));
    } else {
      this.updateYearFilter([...this.selectedYears, year]);
    }
  }
  
  /**
   * Returns filtered yearly trends based on selected years
   * This allows users to focus on specific time periods for analysis
   * 
   * @returns Filtered array of yearly budget trends
   */
  getFilteredTrends(): YearlyBudgetTrend[] {
    if (!this.budgetStats || !this.selectedYears.length) return [];
    return this.budgetStats.yearlyTrends.filter(trend => 
      this.selectedYears.includes(trend.year)
    );
  }

  /**
   * Formats a number as currency (USD)
   * Uses browser's Intl.NumberFormat for locale-appropriate formatting
   * 
   * @param value The number to format
   * @returns Formatted currency string (e.g., "$1,234.56")
   */
  formatCurrency(value: number): string {
    if (isNaN(value) || value === undefined) {
      return '$0.00';
    }
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value);
  }

  /**
   * Formats a number as a percentage
   * 
   * @param value The number to format
   * @returns Formatted percentage string (e.g., "42%")
   */
  formatPercentage(value: number): string {
    return `${value}%`;
  }
  
  /**
   * Calculates the height for a trend bar in the chart
   * Scales the bar height proportionally to the maximum budget in all trends
   * 
   * Calculation: (trend's budget / max budget) * maximum height in pixels
   * 
   * @param trend The yearly budget trend
   * @returns CSS height value (e.g., "120px")
   */
  getTrendBarHeight(trend: YearlyBudgetTrend): string {
    const maxHeight = 150; // Maximum height in pixels
    const maxBudget = this.getMaxBudgetInTrends();
    if (maxBudget === 0) return '0px';
    const height = (trend.totalBudget / maxBudget) * maxHeight;
    return `${height}px`;
  }
  
  /**
   * Calculates the height for the "spent" portion of a trend bar
   * Scales the spent amount proportionally to the maximum budget
   * 
   * Calculation: (trend's spent amount / max budget) * maximum height in pixels
   * 
   * @param trend The yearly budget trend
   * @returns CSS height value (e.g., "75px")
   */
  getSpentBarHeight(trend: YearlyBudgetTrend): string {
    const maxHeight = 150; // Maximum height in pixels
    const maxBudget = this.getMaxBudgetInTrends();
    if (maxBudget === 0) return '0px';
    const height = (trend.spentToDate / maxBudget) * maxHeight;
    return `${height}px`;
  }
  
  /**
   * Finds the maximum budget amount across all yearly trends
   * Used to scale the chart bars proportionally
   * 
   * @returns Maximum budget value or 0 if no data
   */
  getMaxBudgetInTrends(): number {
    if (!this.budgetStats?.yearlyTrends.length) return 0;
    return Math.max(...this.budgetStats.yearlyTrends.map(trend => trend.totalBudget));
  }
  
  /**
   * Triggers a refresh of the budget data
   * Prevents multiple simultaneous refresh requests
   */
  refresh(): void {
    if (!this.isLoadingData) {
      this.loadBudgetStatistics();
    }
  }

  /**
   * Determines if there is meaningful budget data to display
   * Used to show empty state when no real data exists
   * 
   * @returns true if there is actual budget data, false otherwise
   */
  hasBudgetData(): boolean {
    if (!this.budgetStats) return false;
    
    // Check if we have any meaningful data to display
    return (
      this.budgetStats.totalAllocated > 0 || 
      this.budgetStats.entitiesBreakdown?.length > 0 || 
      this.budgetStats.yearlyTrends?.length > 0
    );
  }

  /**
   * Toggles the visibility of the calculation methodology information
   * Allows users to see or hide detailed explanation of how numbers are calculated
   */
  toggleCalculationInfo(): void {
    this.showCalculationInfo = !this.showCalculationInfo;
  }
}
