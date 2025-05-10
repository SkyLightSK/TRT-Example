import { Routes } from '@angular/router';
import { LayoutComponent } from './core/components/layout/layout.component';
import { authGuard, authGuardChild } from './core/guards/auth.guard';
import { LoginComponent } from './features/auth/login/login.component';

export const routes: Routes = [
  // Auth routes - these come first and are not protected
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'unauthorized',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  
  // Protected routes - these require authentication
  {
    path: '',
    component: LayoutComponent,
    canActivate: [authGuard],
    canActivateChild: [authGuardChild],
    children: [
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
      },
      {
        path: 'dashboard',
        loadChildren: () => import('./features/dashboard/dashboard.module').then(m => m.DashboardModule)
      },
      {
        path: 'hardware',
        loadChildren: () => import('./features/hardware/hardware.module').then(m => m.HardwareModule)
      },
      {
        path: 'budget',
        loadChildren: () => import('./features/budget/budget.module').then(m => m.BudgetModule)
      },
      {
        path: 'admin',
        loadChildren: () => import('./features/admin/admin.module').then(m => m.AdminModule),
        data: { requiredRole: 'ADMIN' }
      }
    ]
  },
  
  // Catch-all route - redirect to login
  {
    path: '**',
    redirectTo: 'login'
  }
];
