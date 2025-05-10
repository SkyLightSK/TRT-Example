import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiService } from '../../../core/services/api.service';

interface Budget {
  id: number;
  name: string;
  fiscalYear: number;
  totalAmount: number;
  startDate: Date;
  endDate: Date;
  notes?: string;
  entity?: any;
}

interface BudgetItem {
  id: number;
  description: string;
  amount: number;
  notes?: string;
  budget: Budget | any;
  entity?: any;
}

@Component({
  selector: 'app-budget-list',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './budget-list.component.html',
  styleUrls: ['./budget-list.component.scss']
})
export class BudgetListComponent implements OnInit {
  // Data
  budgets: Budget[] = [];
  filteredBudgets: Budget[] = [];
  budgetItems: BudgetItem[] = [];
  
  // UI state
  selectedYear: number = new Date().getFullYear();
  availableYears: number[] = [];
  activeTab: 'budgets' | 'items' = 'budgets';
  loading = false;
  loadingItems = false;
  showModal = false;
  editingBudget: Budget | null = null;
  
  // Form
  budgetForm: FormGroup;

  constructor(
    private apiService: ApiService,
    private fb: FormBuilder
  ) {
    this.budgetForm = this.createBudgetForm();
    this.generateYearOptions();
  }

  ngOnInit(): void {
    this.loadBudgets();
    this.loadBudgetItems();
  }

  createBudgetForm(): FormGroup {
    return this.fb.group({
      name: ['', Validators.required],
      fiscalYear: [this.selectedYear, Validators.required],
      totalAmount: [0, [Validators.required, Validators.min(1)]],
      startDate: [null],
      endDate: [null],
      notes: ['']
    });
  }

  generateYearOptions(): void {
    const currentYear = new Date().getFullYear();
    this.availableYears = [
      currentYear - 2,
      currentYear - 1,
      currentYear,
      currentYear + 1,
      currentYear + 2
    ];
  }

  loadBudgets(): void {
    this.loading = true;
    this.apiService.getBudgets(this.selectedYear).subscribe({
      next: (data) => {
        this.budgets = data;
        this.filterBudgetsByYear();
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading budgets:', error);
        this.loading = false;
      }
    });
  }

  loadBudgetItems(): void {
    this.loadingItems = true;
    this.apiService.getBudgetItems().subscribe({
      next: (data) => {
        this.budgetItems = data;
        this.loadingItems = false;
      },
      error: (error) => {
        console.error('Error loading budget items:', error);
        this.loadingItems = false;
      }
    });
  }

  filterBudgetsByYear(): void {
    if (this.selectedYear) {
      this.filteredBudgets = this.budgets.filter(budget => 
        budget.fiscalYear === this.selectedYear
      );
    } else {
      this.filteredBudgets = [...this.budgets];
    }
  }

  onYearChange(year: number): void {
    this.selectedYear = year;
    this.loadBudgets();
  }

  getTotalAmount(): number {
    return this.filteredBudgets.reduce((sum, budget) => sum + Number(budget.totalAmount), 0);
  }

  getBudgetName(item: BudgetItem): string {
    if (typeof item.budget === 'object' && item.budget !== null) {
      return item.budget.name || 'Unknown Budget';
    }
    
    // If budget is just an ID, try to find it in our budgets list
    const budget = this.budgets.find(b => b.id === item.budget);
    return budget ? budget.name : 'Unknown Budget';
  }

  onAdd(): void {
    this.editingBudget = null;
    this.budgetForm.reset({
      fiscalYear: this.selectedYear,
      totalAmount: 0
    });
    this.showModal = true;
  }

  onEditBudget(budget: Budget): void {
    this.editingBudget = budget;
    
    // Format dates for the form
    const startDate = budget.startDate ? new Date(budget.startDate).toISOString().split('T')[0] : null;
    const endDate = budget.endDate ? new Date(budget.endDate).toISOString().split('T')[0] : null;
    
    this.budgetForm.setValue({
      name: budget.name,
      fiscalYear: budget.fiscalYear,
      totalAmount: budget.totalAmount,
      startDate: startDate,
      endDate: endDate,
      notes: budget.notes || ''
    });
    
    this.showModal = true;
  }

  onDeleteBudget(budget: Budget): void {
    if (confirm(`Are you sure you want to delete the budget "${budget.name}"?`)) {
      this.apiService.deleteBudget(budget.id).subscribe({
        next: () => {
          this.loadBudgets();
        },
        error: (error) => {
          console.error('Error deleting budget:', error);
        }
      });
    }
  }

  viewBudgetItems(budget: Budget): void {
    this.activeTab = 'items';
    // Optional: filter the items to show only those for the selected budget
    // this.loadBudgetItemsByBudgetId(budget.id);
  }

  onEditBudgetItem(item: BudgetItem): void {
    // TODO: Implement budget item editing
    console.log('Edit budget item:', item);
  }

  onDeleteBudgetItem(item: BudgetItem): void {
    // TODO: Implement budget item deletion
    console.log('Delete budget item:', item);
  }

  closeModal(): void {
    this.showModal = false;
  }

  saveBudget(): void {
    if (this.budgetForm.invalid) {
      return;
    }
    
    const budgetData = this.budgetForm.value;
    
    if (this.editingBudget) {
      // Update existing budget
      this.apiService.updateBudget(this.editingBudget.id, budgetData).subscribe({
        next: () => {
          this.closeModal();
          this.loadBudgets();
        },
        error: (error) => {
          console.error('Error updating budget:', error);
        }
      });
    } else {
      // Create new budget
      this.apiService.createBudget(budgetData).subscribe({
        next: () => {
          this.closeModal();
          this.loadBudgets();
        },
        error: (error) => {
          console.error('Error creating budget:', error);
        }
      });
    }
  }
} 