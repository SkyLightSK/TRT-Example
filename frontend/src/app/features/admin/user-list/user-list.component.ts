import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../../core/services/api.service';

interface Entity {
  id: string;
  name: string;
}

interface User {
  id: string;
  username: string;
  email: string;
  roles: string[];
  impersonableEntities: Entity[];
  status: 'Active' | 'Inactive' | 'Pending';
}

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss']
})
export class UserListComponent implements OnInit {
  users: User[] = [];
  searchTerm: string = '';

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    // TODO: Replace with actual API call when available
    // For now, using mock data
    this.users = [
      {
        id: '1',
        username: 'admin',
        email: 'admin@example.com',
        roles: ['Admin'],
        impersonableEntities: [
          { id: '1', name: 'Store A' },
          { id: '2', name: 'Store B' }
        ],
        status: 'Active'
      },
      {
        id: '2',
        username: 'operator',
        email: 'operator@example.com',
        roles: ['Operator'],
        impersonableEntities: [
          { id: '1', name: 'Store A' }
        ],
        status: 'Active'
      }
    ];
  }

  onAdd(): void {
    // TODO: Implement add functionality
    console.log('Add new user');
  }

  onEdit(user: User): void {
    // TODO: Implement edit functionality
    console.log('Edit user:', user);
  }

  onManageRoles(user: User): void {
    // TODO: Implement role management
    console.log('Manage roles for user:', user);
  }

  onDelete(user: User): void {
    // TODO: Implement delete functionality
    console.log('Delete user:', user);
  }

  onSearch(term: string): void {
    this.searchTerm = term;
    // TODO: Implement search functionality
    console.log('Search term:', term);
  }
} 