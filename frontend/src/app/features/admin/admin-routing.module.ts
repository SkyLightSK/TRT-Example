import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminDashboardComponent } from './admin-dashboard/admin-dashboard.component';
// Import mock components for future implementation
import { SystemSettingsComponent } from './system-settings/system-settings.component';
import { AuditLogsComponent } from './audit-logs/audit-logs.component';

const routes: Routes = [
  {
    path: '',
    component: AdminDashboardComponent
  },
  {
    path: 'users',
    loadComponent: () => import('./user-list/user-list.component').then(m => m.UserListComponent)
  },
  {
    path: 'entities',
    loadComponent: () => import('./entity-management/entity-management.component').then(m => m.EntityManagementComponent)
  },
  {
    path: 'settings',
    component: SystemSettingsComponent
  },
  {
    path: 'audit-logs',
    component: AuditLogsComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { } 