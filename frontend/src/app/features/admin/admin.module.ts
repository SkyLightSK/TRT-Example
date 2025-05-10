import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminRoutingModule } from './admin-routing.module';
import { AdminDashboardComponent } from './admin-dashboard/admin-dashboard.component';
import { SystemSettingsComponent } from './system-settings/system-settings.component';
import { AuditLogsComponent } from './audit-logs/audit-logs.component';

// Material imports
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    AdminRoutingModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    // Import standalone components
    AdminDashboardComponent,
    SystemSettingsComponent,
    AuditLogsComponent
  ]
})
export class AdminModule { } 