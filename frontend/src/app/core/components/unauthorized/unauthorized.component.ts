import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-unauthorized',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="unauthorized-container">
      <div class="unauthorized-content">
        <div class="icon">
          <i class="material-icons">block</i>
        </div>
        <h1>Access Denied</h1>
        <p>You don't have permission to access this page.</p>
        <div class="actions">
          <a routerLink="/dashboard" class="btn-back">Back to Dashboard</a>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .unauthorized-container {
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
      background-color: #f5f5f5;
      padding: 20px;
    }
    
    .unauthorized-content {
      background-color: white;
      border-radius: 8px;
      box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
      padding: 40px;
      text-align: center;
      max-width: 500px;
    }
    
    .icon {
      font-size: 64px;
      color: #f44336;
      margin-bottom: 20px;
    }
    
    h1 {
      color: #424242;
      margin: 0 0 10px 0;
    }
    
    p {
      color: #757575;
      margin-bottom: 30px;
    }
    
    .actions {
      margin-top: 20px;
    }
    
    .btn-back {
      display: inline-block;
      padding: 10px 20px;
      background-color: #1976d2;
      color: white;
      text-decoration: none;
      border-radius: 4px;
      transition: background-color 0.2s;
    }
    
    .btn-back:hover {
      background-color: #1565c0;
    }
  `]
})
export class UnauthorizedComponent {} 