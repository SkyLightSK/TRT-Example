import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatPaginatorModule, MatPaginator } from '@angular/material/paginator';
import { MatSortModule, MatSort } from '@angular/material/sort';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ApiService } from '../../../core/services/api.service';

interface Entity {
  id: string;
  name: string;
  description: string;
  code: string;
  parentId: string | null;
  parentName?: string;
  childCount: number;
}

@Component({
  selector: 'app-entity-management',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    MatFormFieldModule,
    MatDialogModule,
    MatSnackBarModule,
    MatTooltipModule,
    MatMenuModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './entity-management.component.html',
  styleUrls: ['./entity-management.component.scss']
})
export class EntityManagementComponent implements OnInit {
  displayedColumns: string[] = ['name', 'description', 'code', 'parent', 'childCount', 'actions'];
  dataSource = new MatTableDataSource<Entity>([]);
  isLoading = false;
  filterValue = '';

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private apiService: ApiService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadEntities();
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  loadEntities(): void {
    this.isLoading = true;
    // TODO: Replace with actual API call when available
    // For now, using mock data
    setTimeout(() => {
      this.dataSource.data = [
        {
          id: '1',
          name: 'Aaron, James D Jr',
          description: 'Owner/Operator for North Region',
          code: 'NO-001',
          parentId: null,
          childCount: 2
        },
        {
          id: '2',
          name: 'Smith, Sarah K',
          description: 'Owner/Operator for East Region',
          code: 'EA-001',
          parentId: null,
          childCount: 1
        },
        {
          id: '3',
          name: 'Johnson, Michael T',
          description: 'Owner/Operator for West Region',
          code: 'WE-001',
          parentId: null,
          childCount: 1
        },
        {
          id: '4',
          name: 'Store #1234 - North Oak',
          description: 'North Oak Street Location',
          code: 'NO-1234',
          parentId: '1',
          parentName: 'Aaron, James D Jr',
          childCount: 0
        },
        {
          id: '5',
          name: 'Store #2345 - East Main',
          description: 'East Main Street Location',
          code: 'EA-2345',
          parentId: '2',
          parentName: 'Smith, Sarah K',
          childCount: 0
        },
        {
          id: '6',
          name: 'Store #3456 - West Lake',
          description: 'West Lake Avenue Location',
          code: 'WE-3456',
          parentId: '3',
          parentName: 'Johnson, Michael T',
          childCount: 0
        }
      ];
      this.isLoading = false;
    }, 500);
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.filterValue = filterValue.trim().toLowerCase();
    this.dataSource.filter = this.filterValue;

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  openEntityDialog(entity?: Entity): void {
    // TODO: Implement entity form dialog
    console.log('Open entity dialog:', entity || 'new entity');
    this.snackBar.open(entity ? 'Edit entity dialog opened' : 'Add entity dialog opened', 'Close', { duration: 3000 });
  }

  viewChildren(entity: Entity): void {
    // TODO: Implement viewing children entities
    console.log('View children of entity:', entity);
    this.snackBar.open(`Viewing children of ${entity.name}`, 'Close', { duration: 3000 });
  }

  confirmDelete(entity: Entity): void {
    if (confirm(`Are you sure you want to delete entity ${entity.name}?`)) {
      // TODO: Implement entity deletion
      console.log('Delete entity:', entity);
      this.snackBar.open(`Entity ${entity.name} deleted successfully`, 'Close', { duration: 3000 });
      
      // Mock deletion from the list
      this.dataSource.data = this.dataSource.data.filter(e => e.id !== entity.id);
    }
  }
} 