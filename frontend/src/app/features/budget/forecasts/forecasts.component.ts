import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ForecastService, Forecast } from '../services/forecast.service';

@Component({
  selector: 'app-forecasts',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './forecasts.component.html',
  styleUrls: ['./forecasts.component.scss']
})
export class ForecastsComponent implements OnInit {
  isLoading = false;
  forecasts: Forecast[] = [];
  summary: {
    totalPlanned: number;
    totalActual: number;
    totalVariance: number;
    yearOverYearGrowth: number;
  } | null = null;
  displayedColumns: string[] = ['year', 'category', 'plannedAmount', 'actualAmount', 'variance', 'trend'];

  constructor(private forecastService: ForecastService) {}

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.isLoading = true;
    
    // Load both forecasts and summary
    this.forecastService.getForecasts().subscribe({
      next: (data) => {
        this.forecasts = data;
        this.forecastService.getForecastSummary().subscribe({
          next: (summary) => {
            this.summary = summary;
            this.isLoading = false;
          },
          error: (error) => {
            console.error('Error loading summary:', error);
            this.isLoading = false;
          }
        });
      },
      error: (error) => {
        console.error('Error loading forecasts:', error);
        this.isLoading = false;
      }
    });
  }
} 