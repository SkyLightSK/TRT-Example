**TRT Portal Showcase Architecture**

**Overview:** This internal “TRT” portal is not guest-facing but a **Technology Refresh Tool** (or **Terminal Replacement Tracker**) used by IT and operations teams to:

* **Inventory** all field hardware (POS terminals, kiosks, digital-menu boards, enclosures, etc.)
* **Track** end-of-life dates, required upgrades, and replacements
* **Forecast** capital and operational budgets per restaurant or operator
* **Schedule** maintenance windows and generate status/health reports

*Key clues from the original site review:*

* URL `trt.mcd.com` with header “TRT Portal”
* Ability to “impersonate” Owner/Operator (e.g., Aaron, James D Jr) to view store groups
* Cards for “Historical Budget” and “Budget Summary Yearly Projection” showing line items like “Technology Initiative Spend”
* Hardware section listing Verifone devices, EOL dates, statuses, and “Eligible Upgrade” models
* Lifecycle sections for DMB Media Player, Enclosures, plus exportable device lists

These details directly inform our architecture and data model decisions.

**TRT Portal Showcase Architecture**

This document will guide us through building an advanced, scalable TRT-style portal using Angular (frontend) and Nest.js (backend), in three progressive steps:

---

### 2.1 Auth & Impersonation

| Method | Path              | Description                                         |
| ------ | ----------------- | --------------------------------------------------- |
| POST   | /auth/login       | Authenticate user, return access & refresh JWTs     |
| POST   | /auth/refresh     | Exchange refresh token for new access token         |
| POST   | /auth/logout      | Revoke refresh token                                |
| GET    | /auth/me          | Return current user profile and roles               |
| GET    | /entities         | List entities the user can impersonate              |
| POST   | /auth/impersonate | Switch context to another entity (issue scoped JWT) |

**Request/Response samples:**

```http
POST /auth/login
Content-Type: application/json

{ "username": "s.singh", "password": "••••" }
```

```json
200 OK
{ "accessToken": "<jwt>", "refreshToken": "<token>", "expiresIn": 3600 }
```

```http
GET /entities
Authorization: Bearer <jwt>
```

```json
200 OK
[ { "id": "uuid-123", "name": "Aaron, James D Jr" }, ... ]
```

```http
POST /auth/impersonate
Authorization: Bearer <jwt>
Content-Type: application/json

{ "entityId": "uuid-123" }
```

```json
200 OK
{ "accessToken": "<jwt-scoped>", "expiresIn": 3600 }
```

---

### 2.2 Devices CRUD

Endpoints to manage hardware inventory scoped per entity context:

| Method | Path                         | Description                               |
| ------ | ---------------------------- | ----------------------------------------- |
| GET    | /devices                     | List all devices for current entity       |
| GET    | /devices/\:id                | Retrieve a single device by ID            |
| POST   | /devices                     | Create a new device record                |
| PUT    | /devices/\:id                | Update an existing device                 |
| DELETE | /devices/\:id                | Remove or retire a device                 |
| GET    | /entities/\:entityId/devices | (Admin) List devices for specified entity |

**Sample Create payload:**

```json
POST /devices
Authorization: Bearer <jwt>
Content-Type: application/json

{
  "nsn": "123-456-789",
  "type": "Kiosk",
  "manufacturer": "Verifone",
  "model": "MX915 PCI3",
  "location": "POS01",
  "endOfLife": "2027-12-31",
  "status": "Active"
}
```

---

### 2.3 BudgetItems CRUD

Manage yearly budget forecasts and actual spend:

| Method | Path | Description |
|--------|------|-------------|
| GET    | /budgets                                     | List all budget items for current entity     |
| GET    | /budgets/:id                                 | Retrieve a single budget item by ID          |
| POST   | /budgets                                     | Create a new budget item                     |
| PUT    | /budgets/:id                                 | Update an existing budget item               |
| DELETE | /budgets/:id                                 | Remove a budget item                         |
| GET    | /entities/:entityId/budgets                  | (Admin) List budgets for specified entity    |

**Sample Create payload:**

```json
POST /budgets
Authorization: Bearer <jwt>
Content-Type: application/json

{
  "year": 2025,
  "category": "Technology Initiative Spend",
  "plannedAmount": 120000,
  "actualAmount": 45000
}
```

\-----------|----------------------------------------------|----------------------------------------------|
\| GET    | /budgets                                     | List all budget items for current entity     |
\| GET    | /budgets/\:id                                 | Retrieve a single budget item by ID          |
\| POST   | /budgets                                     | Create a new budget item                     |
\| PUT    | /budgets/\:id                                 | Update an existing budget item               |
\| DELETE | /budgets/\:id                                 | Remove a budget item                         |
\| GET    | /entities/\:entityId/budgets                  | (Admin) List budgets for specified entity    |

**Sample Create payload:**

```json
POST /budgets
Authorization: Bearer <jwt>
Content-Type: application/json

{
  "year": 2025,
  "category": "Technology Initiative Spend",
  "plannedAmount": 120000,
  "actualAmount": 45000
}
```

| Method | Path | Description |
|--------|------|-------------|
| GET    | /devices                                 | List all devices for current entity       |
| GET    | /devices/:id                             | Retrieve a single device by ID             |
| POST   | /devices                                 | Create a new device record                 |
| PUT    | /devices/:id                             | Update an existing device                  |
| DELETE | /devices/:id                             | Remove or retire a device                  |
| GET    | /entities/:entityId/devices              | (Admin) List devices for specified entity |


**Sample Create payload:**

```json
POST /devices
Authorization: Bearer <jwt>
Content-Type: application/json

{
  "nsn": "123-456-789",
  "type": "Kiosk",
  "manufacturer": "Verifone",
  "model": "MX915 PCI3",
  "location": "POS01",
  "endOfLife": "2027-12-31",
  "status": "Active"
}
```

| Method | Path | Description |
|--------|------|-------------|
| POST   | /auth/login            | Authenticate user, return access & refresh JWTs |
| POST   | /auth/refresh          | Exchange refresh token for new access token  |
| POST   | /auth/logout           | Revoke refresh token                         |
| GET    | /auth/me               | Return current user profile and roles        |
| GET    | /entities              | List entities the user can impersonate       |
| POST   | /auth/impersonate      | Switch context to another entity (issue scoped JWT) |

**Request/Response samples:**

```http
POST /auth/login
Content-Type: application/json

{ "username": "s.singh", "password": "••••" }
```

```json
200 OK
{ "accessToken": "<jwt>", "refreshToken": "<token>", "expiresIn": 3600 }
```

```http
GET /entities
Authorization: Bearer <jwt>
```

```json
200 OK
[ { "id": "uuid-123", "name": "Aaron, James D Jr" }, ... ]
```

```http
POST /auth/impersonate
Authorization: Bearer <jwt>
Content-Type: application/json

{ "entityId": "uuid-123" }
```

```json
200 OK
{ "accessToken": "<jwt-scoped>", "expiresIn": 3600 }
```

---

## 1. Data Model Sketch

We will define the core domain entities, their attributes, and relationships needed to support:

* Multi-tenant contexts (Owner/Operator impersonation)
* Hardware inventory with lifecycle tracking
* Budget forecasting and historical spend
* Notifications and reporting

### 1.1. Core Entities

* **User**: authentication, roles, permissions
* **Entity** (Owner/Operator): store groups, multi-tenancy
* **Device**: type, manufacturer, model, NSN, location, EOL date, status, eligible upgrade
* **BudgetItem**: year, category, planned spend, actual spend
* **Notification**: message, type, entity context, timestamp, read/unread

### 1.2. Relationships

* A **User** can impersonate one or more **Entities**
* An **Entity** owns many **Devices** and **BudgetItems**
* **Notifications** are scoped to a **User** or an **Entity**

---

### 1.3. Entity Attributes

#### User

| Field                | Type      | Description                        |
| -------------------- | --------- | ---------------------------------- |
| id                   | UUID      | Primary key                        |
| username             | string    | Login identifier                   |
| email                | string    | Contact email                      |
| passwordHash         | string    | Hashed password                    |
| roles                | string\[] | e.g., \["Admin","Operator"]        |
| impersonableEntities | UUID\[]   | Entity IDs this user can switch to |

#### Entity (Owner/Operator)

| Field          | Type         | Description                        |
| -------------- | ------------ | ---------------------------------- |
| id             | UUID         | Primary key                        |
| name           | string       | e.g., "Aaron, James D Jr"          |
| parentEntityId | UUID \| null | For nested organizational contexts |

#### Device

| Field           | Type                                         | Description                   |
| --------------- | -------------------------------------------- | ----------------------------- |
| id              | UUID                                         | Primary key                   |
| nsn             | string                                       | Device serial number          |
| type            | enum \['Kiosk','Register','DMB','Enclosure'] | Device category               |
| manufacturer    | string                                       | e.g., 'Verifone'              |
| model           | string                                       | e.g., 'MX915 PCI3'            |
| location        | string                                       | e.g., 'POS01'                 |
| endOfLife       | Date                                         | Planned replacement date      |
| status          | enum \['Active','Required','Retired']        | Current lifecycle status      |
| eligibleUpgrade | string \| null                               | Next-model identifier or name |
| entityId        | UUID                                         | FK to Entity                  |

#### BudgetItem

| Field         | Type   | Description                         |
| ------------- | ------ | ----------------------------------- |
| id            | UUID   | Primary key                         |
| entityId      | UUID   | FK to Entity                        |
| year          | number | e.g., 2025                          |
| category      | string | e.g., 'Technology Initiative Spend' |
| plannedAmount | number | Budgeted value                      |
| actualAmount  | number | Spent to date                       |

#### Notification

| Field     | Type                             | Description                   |
| --------- | -------------------------------- | ----------------------------- |
| id        | UUID                             | Primary key                   |
| entityId  | UUID \| null                     | Scoped entity (or user-level) |
| userId    | UUID \| null                     | Targeted user                 |
| message   | string                           | Notification text             |
| type      | enum \['Info','Warning','Alert'] | Notification category         |
| createdAt | Date                             | Timestamp                     |
| read      | boolean                          | Read/unread flag              |

## 2. API Contract

We’ll outline REST endpoints (can be adapted to GraphQL) for:

* **Auth & Impersonation**
* **Devices**, **BudgetItems**, **Notifications** CRUD
* **Reporting & Export** endpoints

---

We’ll outline REST (or GraphQL) endpoints / queries and mutations, including:

* Auth & impersonation
* CRUD for stores, devices, budgets, notifications
* Reporting & export endpoints

---

## 3. UI Wireframes & Module Structure

We’ll structure the Angular app into modular, lazy-loaded pieces with a clear layout:

### 3.1 App Shell & Routing

* **AppComponent**: includes `<mcd-navbar>` and `<mcd-sidebar>` with router outlets
* **Routes** defined in `app-routing.module.ts`:

  ```ts
  const routes: Routes = [
    { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
    { path: 'dashboard', loadChildren: () => import('./features/dashboard/dashboard.module').then(m => m.DashboardModule) },
    { path: 'hardware', loadChildren: () => import('./features/hardware/hardware.module').then(m => m.HardwareModule) },
    { path: 'budget', loadChildren: () => import('./features/budget/budget.module').then(m => m.BudgetModule) },
    { path: 'impersonation', loadChildren: () => import('./features/impersonation/impersonation.module').then(m => m.ImpersonationModule) },
    { path: 'admin', loadChildren: () => import('./features/admin/admin.module').then(m => m.AdminModule) },
    { path: '**', redirectTo: 'dashboard' }
  ];
  ```

### 3.2 Core & Shared Modules

* **CoreModule** (imported once in AppModule):

  * `AuthService`, `ApiService`, `TokenInterceptor`, global guards
  * `LayoutComponent` with navbar/sidebar
* **SharedModule** (imported everywhere):

  * Reusable UI components (`CardComponent`, `TableComponent`, `FormControls`)
  * Common pipes (`DateFormatPipe`, `CurrencyPipe`)
  * Utility directives

### 3.3 Feature Modules

Each feature module lives under `src/app/features/` and contains:

* Feature routing
* Components, services, store (NgRx slice)

1. **DashboardModule**

   * `DashboardComponent`, `BudgetSummaryCard`, `DeviceStatusChart`
2. **HardwareModule**

   * `DeviceListComponent`, `DeviceDetailComponent`, `DeviceFormComponent`
   * `HardwareService` wraps `/devices` API
3. **BudgetModule**

   * `BudgetListComponent`, `BudgetChartComponent`, `BudgetFormComponent`
   * `BudgetService` wraps `/budgets` API
4. **ImpersonationModule**

   * `ImpersonationListComponent` (dropdown of entities)
   * Service to call `/entities` and `/auth/impersonate`
5. **AdminModule**

   * `UserListComponent`, `RoleManagementComponent`, `SettingsComponent`

### 3.4 State Management & Effects

* **NgRx Store** structure:

  * `auth` slice (user, token)
  * `entity` slice (current entity context)
  * `device`, `budget`, `notification` slices
* **Effects** to handle side effects:

  * Login, impersonate, load initial data after context switch
  * CRUD operations with optimistic updates

### 3.5 Wireframe Sketches

Below are ASCII-style wireframes for key screens:

**Dashboard Screen**

```
┌─────────────────────────────────────────────────────────────┐
│ <mcd-navbar>                                               │
├──────────┬─────────────────────────────────────────────────┤
│ <sidebar>│ Dashboard                                       │
│          │                                                 │
│          │ ┌───────────────┐  ┌───────────────┐  ┌────────┐ │
│          │ │ Budget Summary│  │ Device Status │  │ Alerts │ │
│          │ │   Card        │  │   Chart       │  │ Card   │ │
│          │ └───────────────┘  └───────────────┘  └────────┘ │
│          │                                                 │
│          │ ┌───────────────────────────┐                 │
│          │ │ Recent Notifications List │                 │
│          │ └───────────────────────────┘                 │
│          │                                                 │
└──────────┴─────────────────────────────────────────────────┘
```

**Hardware (Device List) Screen**

```
┌─────────────────────────────────────────────────────────────┐
│ <mcd-navbar>                                               │
├──────────┬─────────────────────────────────────────────────┤
│ <sidebar>│ Device Inventory                                │
│          │ ┌───────────────────────────────────────────┐    │
│          │ │ [Filter dropdown] [Search input] [Export] │    │
│          │ └───────────────────────────────────────────┘    │
│          │                                                 │
│          │ ┌───────────────────────────────────────────┐    │
│          │ │ ID │ Type   │ Model       │ EOL Date │ ... │    │
│          │ │----┼--------┼-------------┼----------┼-----│    │
│          │ │... │ ...    │ ...         │ ...      │ ... │    │
│          │ └───────────────────────────────────────────┘    │
│          │                                                 │
└──────────┴─────────────────────────────────────────────────┘
```

**Device Detail / Edit Modal**

```
┌────────────────────────────────────┐
│ Device Details                     │ [×]
├────────────────────────────────────┤
│ NSN:        [123-456-789]          │
│ Type:       [Kiosk      ▼]         │
│ Manufacturer:[Verifone   ▼]         │
│ Model:      [MX915 PCI3  ]         │
│ Location:   [POS01       ]         │
│ EOL Date:   [2027-12-31   ]         │
│ Status:     [Active      ▼]         │
│ Eligible Up:[MX925        ]         │
│                                    │
│ [ Save ]       [ Cancel ]          │
└────────────────────────────────────┘
```

**Budget Screen (Chart & Table)**

```
┌─────────────────────────────────────────────────────────────┐
│ <mcd-navbar>                                               │
├──────────┬─────────────────────────────────────────────────┤
│ <sidebar>│ Budget Forecast                                   │
│          │                                                 │
│          │ ┌───────────────────────────────────────────┐    │
│          │ │ Budget vs Actual (Bar Chart)              │    │
│          │ └───────────────────────────────────────────┘    │
│          │                                                 │
│          │ ┌───────────────────────────────────────────┐    │
│          │ │ Year │ Category │ Planned │ Actual │ Diff   │  │
│          │ │-----┼----------┼---------┼--------┼--------│  │
│          │ │ ... │ ...      │ ...     │ ...    │ ...    │  │
│          │ └───────────────────────────────────────────┘    │
│          │                                                 │
└──────────┴─────────────────────────────────────────────────┘
```

**Impersonation Dropdown**

```
┌─────────────────────────────────┐
│ Current: Aaron, James D Jr ▼   │
│ ├──🏬 Store A                  │
│ ├──🏬 Store B                  │
│ └──🏬 Store C                  │
└─────────────────────────────────┘
```

Feel free to refine any wireframe or request additions for other screens (e.g., Reports, Admin).
