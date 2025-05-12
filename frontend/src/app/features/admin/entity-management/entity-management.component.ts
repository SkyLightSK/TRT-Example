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
import { EntityFormDialogComponent } from './entity-form-dialog.component';
import { catchError, finalize, of } from 'rxjs';

interface Entity {
  id: number;
  name: string;
  description: string;
  code: string;
  parentId: number | null;
  parent?: Entity;
  children?: Entity[];
  childCount?: number;
}

interface EntityDto {
  name: string;
  description: string;
  code: string;
  parentId: number | null;
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
  entities: Entity[] = [];
  currentParentId: number | null = null;
  breadcrumbs: Entity[] = [];

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

  loadEntities(parentId: number | null = null): void {
    this.isLoading = true;
    this.currentParentId = parentId;
    
    this.apiService.get<Entity[]>('/entities')
      .pipe(
        catchError(error => {
          console.error('Error loading entities:', error);
          this.snackBar.open('Failed to load entities. Please try again.', 'Close', { duration: 5000 });
          return of([]);
        }),
        finalize(() => {
          this.isLoading = false;
        })
      )
      .subscribe((entities: Entity[]) => {
        this.entities = entities;
        
        // Process entities to add child count and parent name
        const processedEntities = entities.map(entity => {
          const childCount = entities.filter(e => e.parentId === entity.id).length;
          const parent = entities.find(e => e.id === entity.parentId);
          
          return {
            ...entity,
            childCount,
            parent
          };
        });
        
        // Filter by parent ID if specified
        if (parentId !== null) {
          this.dataSource.data = processedEntities.filter(entity => entity.parentId === parentId);
          
          // Update breadcrumbs
          this.updateBreadcrumbs(parentId, entities);
        } else {
          // Show top-level entities
          this.dataSource.data = processedEntities.filter(entity => entity.parentId === null);
          this.breadcrumbs = [];
        }
      });
  }

  updateBreadcrumbs(parentId: number, entities: Entity[]): void {
    this.breadcrumbs = [];
    let currentEntity = entities.find(e => e.id === parentId);
    
    while (currentEntity) {
      this.breadcrumbs.unshift(currentEntity);
      currentEntity = entities.find(e => e.id === currentEntity?.parentId);
    }
  }

  navigateToBreadcrumb(entity: Entity | null): void {
    if (entity === null) {
      this.loadEntities();
    } else {
      this.loadEntities(entity.id);
    }
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
    // Filter out the current entity and its children to prevent circular references
    let availableParents = this.entities;
    
    if (entity) {
      const childIds = this.getChildIds(entity);
      availableParents = this.entities.filter(e => 
        e.id !== entity.id && !childIds.includes(e.id)
      );
    }
    
    const dialogRef = this.dialog.open(EntityFormDialogComponent, {
      width: '500px',
      data: {
        entity: entity,
        entities: availableParents
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (entity) {
          this.updateEntity(entity.id, result);
        } else {
          this.createEntity(result);
        }
      }
    });
  }

  getChildIds(entity: Entity): number[] {
    const childIds: number[] = [];
    const getChildren = (id: number) => {
      const children = this.entities.filter(e => e.parentId === id);
      children.forEach(child => {
        childIds.push(child.id);
        getChildren(child.id);
      });
    };
    
    getChildren(entity.id);
    return childIds;
  }

  createEntity(entityData: EntityDto): void {
    this.isLoading = true;
    this.apiService.post<Entity>('/entities', entityData)
      .pipe(
        catchError(error => {
          console.error('Error creating entity:', error);
          this.snackBar.open('Failed to create entity. Please try again.', 'Close', { duration: 5000 });
          return of(null);
        }),
        finalize(() => {
          this.isLoading = false;
        })
      )
      .subscribe((result: Entity | null) => {
        if (result) {
          this.snackBar.open('Entity created successfully', 'Close', { duration: 3000 });
          this.loadEntities(this.currentParentId);
        }
      });
  }

  updateEntity(id: number, entityData: EntityDto): void {
    this.isLoading = true;
    this.apiService.patch<Entity>(`/entities/${id}`, entityData)
      .pipe(
        catchError(error => {
          console.error('Error updating entity:', error);
          this.snackBar.open('Failed to update entity. Please try again.', 'Close', { duration: 5000 });
          return of(null);
        }),
        finalize(() => {
          this.isLoading = false;
        })
      )
      .subscribe((result: Entity | null) => {
        if (result) {
          this.snackBar.open('Entity updated successfully', 'Close', { duration: 3000 });
          this.loadEntities(this.currentParentId);
        }
      });
  }

  viewChildren(entity: Entity): void {
    this.loadEntities(entity.id);
  }

  confirmDelete(entity: Entity): void {
    if (confirm(`Are you sure you want to delete entity ${entity.name}?`)) {
      this.deleteEntity(entity.id);
    }
  }

  deleteEntity(id: number): void {
    this.isLoading = true;
    this.apiService.delete<void>(`/entities/${id}`)
      .pipe(
        catchError(error => {
          console.error('Error deleting entity:', error);
          this.snackBar.open('Failed to delete entity. Please try again.', 'Close', { duration: 5000 });
          return of(null);
        }),
        finalize(() => {
          this.isLoading = false;
        })
      )
      .subscribe(result => {
        this.snackBar.open('Entity deleted successfully', 'Close', { duration: 3000 });
        // Remove from local data while waiting for refresh
        this.dataSource.data = this.dataSource.data.filter(e => e.id !== id);
        this.loadEntities(this.currentParentId);
      });
  }
} 