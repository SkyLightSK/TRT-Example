import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

interface SettingBase {
  name: string;
  description: string;
  type: string;
}

interface TextSetting extends SettingBase {
  type: 'text';
  value: string;
}

interface NumberSetting extends SettingBase {
  type: 'number';
  value: number;
}

interface SelectSetting extends SettingBase {
  type: 'select';
  value: string;
  options: string[];
}

interface ToggleSetting extends SettingBase {
  type: 'toggle';
  value: boolean;
}

type Setting = TextSetting | NumberSetting | SelectSetting | ToggleSetting;

interface SettingsCategory {
  name: string;
  icon: string;
  settings: Setting[];
}

@Component({
  selector: 'app-system-settings',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatTabsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatSlideToggleModule,
    FormsModule,
    ReactiveFormsModule
  ],
  templateUrl: './system-settings.component.html',
  styleUrls: ['./system-settings.component.scss']
})
export class SystemSettingsComponent {
  // Mock settings categories
  settingsCategories: SettingsCategory[] = [
    {
      name: 'General',
      icon: 'settings',
      settings: [
        { name: 'Application Name', type: 'text', value: 'TRT Portal', description: 'The name displayed in the application title' },
        { name: 'Default Language', type: 'select', value: 'en', options: ['en', 'es', 'fr'], description: 'Default language for new users' },
        { name: 'Maintenance Mode', type: 'toggle', value: false, description: 'Enable maintenance mode to prevent user logins' }
      ]
    },
    {
      name: 'Security',
      icon: 'security',
      settings: [
        { name: 'Password Expiry Days', type: 'number', value: 90, description: 'Number of days until user passwords expire' },
        { name: 'Failed Login Attempts', type: 'number', value: 5, description: 'Number of failed login attempts before account lockout' },
        { name: 'Two-Factor Authentication', type: 'toggle', value: false, description: 'Require two-factor authentication for all users' }
      ]
    },
    {
      name: 'Email',
      icon: 'email',
      settings: [
        { name: 'SMTP Server', type: 'text', value: 'smtp.example.com', description: 'SMTP server address' },
        { name: 'SMTP Port', type: 'number', value: 587, description: 'SMTP server port' },
        { name: 'Sender Email', type: 'text', value: 'noreply@example.com', description: 'Email address used to send system emails' }
      ]
    },
    {
      name: 'Notifications',
      icon: 'notifications',
      settings: [
        { name: 'Email Notifications', type: 'toggle', value: true, description: 'Send email notifications for system events' },
        { name: 'Push Notifications', type: 'toggle', value: false, description: 'Send push notifications for system events' },
        { name: 'Notification Frequency', type: 'select', value: 'daily', options: ['real-time', 'hourly', 'daily', 'weekly'], description: 'How often to send notification digests' }
      ]
    }
  ];
} 