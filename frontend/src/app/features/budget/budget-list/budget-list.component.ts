import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../../core/services/api.service';

interface BudgetItem {
  id: string;
  year: number;
  category: string;
  plannedAmount: number;
  actualAmount: number;
  difference: number;
}

@Component({
  selector: 'app-budget-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './budget-list.component.html',
  styleUrls: ['./budget-list.component.scss']
})
export class BudgetListComponent implements OnInit {
  budgets: BudgetItem[] = [];
  selectedYear: number = new Date().getFullYear();

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    this.loadBudgets();
  }

  loadBudgets(): void {
    this.apiService.getBudgets().subscribe({
      next: (data) => {
        this.budgets = data.map((budget: any) => ({
          ...budget,
          difference: budget.plannedAmount - budget.actualAmount
        }));
      },
      error: (error) => {
        console.error('Error loading budgets:', error);
        // TODO: Add proper error handling
      }
    });
  }

  onYearChange(year: number): void {
    this.selectedYear = year;
    this.loadBudgets();
  }

  onAdd(): void {
    // TODO: Implement add functionality
    console.log('Add new budget item');
  }

  onEdit(budget: BudgetItem): void {
    // TODO: Implement edit functionality
    console.log('Edit budget:', budget);
  }

  onDelete(budget: BudgetItem): void {
    // TODO: Implement delete functionality
    console.log('Delete budget:', budget);
  }
} 