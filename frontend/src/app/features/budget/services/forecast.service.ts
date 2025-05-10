import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

export interface Forecast {
  id: number;
  year: number;
  category: string;
  plannedAmount: number;
  actualAmount: number;
  variance: number;
  trend: 'up' | 'down' | 'stable';
}

@Injectable({
  providedIn: 'root'
})
export class ForecastService {
  private mockForecasts: Forecast[] = [
    {
      id: 1,
      year: 2024,
      category: 'Technology Initiative',
      plannedAmount: 120000,
      actualAmount: 95000,
      variance: -25000,
      trend: 'up'
    },
    {
      id: 2,
      year: 2024,
      category: 'Hardware Maintenance',
      plannedAmount: 45000,
      actualAmount: 42000,
      variance: -3000,
      trend: 'stable'
    },
    {
      id: 3,
      year: 2024,
      category: 'Software Licenses',
      plannedAmount: 35000,
      actualAmount: 32000,
      variance: -3000,
      trend: 'up'
    },
    {
      id: 4,
      year: 2024,
      category: 'Cloud Services',
      plannedAmount: 28000,
      actualAmount: 25000,
      variance: -3000,
      trend: 'up'
    },
    {
      id: 5,
      year: 2025,
      category: 'Technology Initiative',
      plannedAmount: 150000,
      actualAmount: 0,
      variance: -150000,
      trend: 'up'
    },
    {
      id: 6,
      year: 2025,
      category: 'Hardware Maintenance',
      plannedAmount: 50000,
      actualAmount: 0,
      variance: -50000,
      trend: 'stable'
    },
    {
      id: 7,
      year: 2025,
      category: 'Software Licenses',
      plannedAmount: 40000,
      actualAmount: 0,
      variance: -40000,
      trend: 'up'
    },
    {
      id: 8,
      year: 2025,
      category: 'Cloud Services',
      plannedAmount: 35000,
      actualAmount: 0,
      variance: -35000,
      trend: 'up'
    }
  ];

  constructor() {}

  getForecasts(): Observable<Forecast[]> {
    // Simulate API delay
    return of(this.mockForecasts);
  }

  getForecastById(id: number): Observable<Forecast | undefined> {
    const forecast = this.mockForecasts.find(f => f.id === id);
    return of(forecast);
  }

  getForecastSummary(): Observable<{
    totalPlanned: number;
    totalActual: number;
    totalVariance: number;
    yearOverYearGrowth: number;
  }> {
    const currentYear = new Date().getFullYear();
    const currentYearForecasts = this.mockForecasts.filter(f => f.year === currentYear);
    const nextYearForecasts = this.mockForecasts.filter(f => f.year === currentYear + 1);

    const summary = {
      totalPlanned: currentYearForecasts.reduce((sum, f) => sum + f.plannedAmount, 0),
      totalActual: currentYearForecasts.reduce((sum, f) => sum + f.actualAmount, 0),
      totalVariance: currentYearForecasts.reduce((sum, f) => sum + f.variance, 0),
      yearOverYearGrowth: this.calculateYearOverYearGrowth(currentYearForecasts, nextYearForecasts)
    };

    return of(summary);
  }

  private calculateYearOverYearGrowth(currentYear: Forecast[], nextYear: Forecast[]): number {
    const currentYearTotal = currentYear.reduce((sum, f) => sum + f.plannedAmount, 0);
    const nextYearTotal = nextYear.reduce((sum, f) => sum + f.plannedAmount, 0);
    
    if (currentYearTotal === 0) return 0;
    return ((nextYearTotal - currentYearTotal) / currentYearTotal) * 100;
  }
} 