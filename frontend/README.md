# Frontend

This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 19.2.11.

## Environment Configuration

The application uses environment-specific configuration files located in `src/environments/`:

- `environment.ts` - Development environment (default)
- `environment.prod.ts` - Production environment 
- `environment.staging.ts` - Staging environment

These files contain environment-specific variables such as API URLs, feature flags, and other configuration:

```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:3000/api',
  authApiPath: '/auth',
  deviceApiPath: '/devices',
  budgetApiPath: '/budgets',
  entityApiPath: '/entities',
  notificationApiPath: '/notifications',
  appName: 'TRT Portal',
  logLevel: 'debug',
};
```

### Building for Different Environments

To build the application for a specific environment, use:

```bash
# Development build (default)
ng build

# Production build
ng build --configuration=production

# Staging build
ng build --configuration=staging
```

## Development server

To start a local development server, run:

```bash
ng serve
```

Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.

## Code scaffolding

Angular CLI includes powerful code scaffolding tools. To generate a new component, run:

```bash
ng generate component component-name
```

For a complete list of available schematics (such as `components`, `directives`, or `pipes`), run:

```bash
ng generate --help
```

## Building

To build the project run:

```bash
ng build
```

This will compile your project and store the build artifacts in the `dist/` directory. By default, the production build optimizes your application for performance and speed.

## Running unit tests

To execute unit tests with the [Karma](https://karma-runner.github.io) test runner, use the following command:

```bash
ng test
```

## Running end-to-end tests

For end-to-end (e2e) testing, run:

```bash
ng e2e
```

Angular CLI does not come with an end-to-end testing framework by default. You can choose one that suits your needs.

## Additional Resources

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.

# TRT Portal Frontend

## Responsive Layout System

The TRT Portal frontend uses a responsive layout system that adapts to different screen sizes:

### Mobile Responsiveness

- **Mobile Breakpoint**: 768px (defined as `$breakpoint-md`)
- **Tablet Breakpoint**: 992px (defined as `$breakpoint-lg`)
- **Desktop Breakpoint**: 1200px

### Layout Components

- **Navbar**: Fixed top navigation with mobile menu toggle
- **Sidebar**: Side navigation that transforms to a slide-in panel on mobile
- **Content Area**: Main content that adjusts based on screen size

### Mobile Navigation

The mobile navigation system includes:
- Hamburger menu toggle for main navigation
- Sidebar toggle for section-specific navigation
- Slide-in panels that overlay the main content
- Backdrop overlay that closes menus when clicked

## CSS Structure

### Global Styles

Located in `src/styles.scss`, these include:

- **Containers**: `.container`, `.container-fluid`, `.page-container`
- **Grid System**: `.grid`, `.grid-2`, `.grid-3`, `.grid-4`
- **Card Components**: `.card` with `.card-header`, `.card-content`, `.card-footer`
- **Button Styles**: `.btn` with variations like `.btn-primary`, `.btn-secondary`
- **Utility Classes**: Margin helpers, text alignment, etc.

### Component-Specific Styles

Each component has its own SCSS file with:
- Component-specific styling
- Mobile adaptations
- State variations

## Usage Guidelines

### Containers

Use the appropriate container class based on your needs:

```html
<!-- Fixed width container that centers content -->
<div class="container">...</div>

<!-- Full-width container with padding -->
<div class="container-fluid">...</div>

<!-- Page container with responsive padding -->
<div class="page-container">...</div>
```

### Grid System

Use the grid system for responsive layouts:

```html
<!-- 2-column grid that collapses to 1 column on mobile -->
<div class="grid grid-2">
  <div>Column 1</div>
  <div>Column 2</div>
</div>

<!-- 3-column grid with responsive breakpoints -->
<div class="grid grid-3">
  <div>Column 1</div>
  <div>Column 2</div>
  <div>Column 3</div>
</div>
```

### Cards

Use the card component for content containers:

```html
<div class="card">
  <div class="card-header">
    <h2>Card Title</h2>
  </div>
  <div class="card-content">
    <!-- Card content here -->
  </div>
  <div class="card-footer">
    <button class="btn btn-primary">Action</button>
  </div>
</div>
```

## Best Practices

1. **Use the provided classes** instead of creating custom containers
2. **Follow the mobile-first approach** when adding new styles
3. **Leverage utility classes** for common styling needs
4. **Keep component styles focused** on component-specific needs
5. **Use variables and mixins** from the global stylesheet

## Table Styles

For consistent table styling across the application, use the following structure:

```html
<div class="table-container">
  <table class="data-table">
    <thead>
      <tr>
        <th>Column 1</th>
        <th>Column 2</th>
        <th class="actions-header">Actions</th>
      </tr>
    </thead>
    <tbody>
      <tr *ngFor="let item of items">
        <td>{{ item.property1 }}</td>
        <td>{{ item.property2 }}</td>
        <td class="actions-cell">
          <button mat-icon-button color="primary">
            <mat-icon>edit</mat-icon>
          </button>
          <button mat-icon-button color="warn">
            <mat-icon>delete</mat-icon>
          </button>
        </td>
      </tr>
    </tbody>
  </table>
  
  <!-- Loading overlay -->
  <div class="loading-shade" *ngIf="isLoading">
    <div class="loading-spinner"></div>
  </div>
</div>
```

### Status Badges

Use the `status-badge` class for displaying status indicators:

```html
<span class="status-badge" [ngClass]="item.status.toLowerCase()">
  {{ item.status }}
</span>
```

Available status classes:
- `active` - Green background
- `inactive`, `retired` - Light gray background
- `warning`, `pending` - Yellow background
- `error`, `failed` - Red background
- `unknown` - Gray background

### Positive/Negative Values

For financial values that can be positive or negative:

```html
<td [ngClass]="{'positive': value > 0, 'negative': value < 0}">
  {{ value | currency }}
</td>
```

## Toolbar Container

Use the toolbar container for filters, search fields, and secondary actions:

```html
<div class="toolbar-container">
  <div class="search-section">
    <!-- Search or filter elements -->
    <mat-form-field class="filter-field" appearance="outline">
      <mat-label>Filter Items</mat-label>
      <input matInput (keyup)="applyFilter($event)">
      <mat-icon matSuffix>search</mat-icon>
    </mat-form-field>
  </div>
  <div class="action-buttons">
    <!-- Secondary actions -->
    <button class="btn btn-secondary">Export</button>
    <button class="btn btn-secondary">Print</button>
  </div>
</div>
```

### Year Selector

For year or time period filtering:

```html
<div class="toolbar-container">
  <div class="search-section">
    <div class="year-selector">
      <label for="year">Fiscal Year:</label>
      <select id="year" [(ngModel)]="selectedYear" (ngModelChange)="onYearChange($event)">
        <option *ngFor="let year of availableYears" [value]="year">{{ year }}</option>
      </select>
    </div>
  </div>
</div>
```

## Standardized Action Buttons

For consistent UI, use these standardized button classes for common actions:

### Standard Header Actions

```html
<div class="dashboard-header">
  <h1>Page Title</h1>
  <div class="actions">
    <button class="btn btn-refresh" (click)="refreshData()">
      <mat-icon>refresh</mat-icon>
      Refresh
    </button>
    <button class="btn btn-add" (click)="addItem()">
      <mat-icon>add</mat-icon>
      Add Item
    </button>
  </div>
</div>
```

### Action Button Types

- **Refresh Button**: Use `btn-refresh` for all refresh/reload actions
```html
<button class="btn btn-refresh">
  <mat-icon>refresh</mat-icon>
  Refresh
</button>
```

- **Add Button**: Use `btn-add` for all creation actions
```html
<button class="btn btn-add">
  <mat-icon>add</mat-icon>
  Add Item
</button>
```

- **General Buttons**: Use other button classes for standard actions
```html
<button class="btn btn-primary">Primary Action</button>
<button class="btn btn-secondary">Secondary Action</button>
<button class="btn btn-danger">Dangerous Action</button>
```

- **Size Variants**: Add size modifiers when needed
```html
<button class="btn btn-secondary btn-sm">Small Button</button>
<button class="btn btn-primary btn-lg">Large Button</button>
```