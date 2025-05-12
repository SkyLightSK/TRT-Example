# TRT Portal

A comprehensive Terminal Resource Tracking (TRT) portal for managing hardware inventory, budgeting, and administrative tasks.

## Overview

The TRT Portal is a full-stack web application built with Angular (frontend) and NestJS (backend) that provides organizations with a centralized platform to manage their hardware inventory, track budgets, and perform various administrative tasks. The application features a responsive design, intuitive user interface, and robust functionality to streamline resource management processes.

## Features

### Dashboard
- Interactive dashboard with key metrics and visualizations
- Budget overview with financial summaries
- Device status monitoring
- Recent notifications
- Upcoming end-of-life hardware alerts

### Hardware Management
- Comprehensive hardware inventory tracking
- Device categorization (terminals, kiosks, etc.)
- Warranty expiration monitoring
- Device status tracking
- Serial number and model tracking

### Budget Management
- Fiscal year budget planning
- Budget allocation tracking
- Budget item management
- Financial reporting

### Administrative Tools
- User management with role-based access control
- Entity management for organizational structure
- Audit logging for security and compliance
- System configuration

## Technical Stack

### Frontend
- **Framework**: Angular with Angular Material UI components
- **Styling**: SCSS with responsive design
- **State Management**: Angular services and RxJS
- **Authentication**: JWT-based authentication
- **API Communication**: HTTP client with RESTful endpoints

### Backend
- **Framework**: NestJS
- **Database**: PostgreSQL
- **ORM**: TypeORM
- **Security**: Passport.js with JWT
- **API**: RESTful API with Express
- **Documentation**: Swagger/OpenAPI
- **Validation**: Class-validator and class-transformer

## Project Structure

### Frontend Structure
```
frontend/
├── src/
│   ├── app/
│   │   ├── core/           # Core modules, services, and components
│   │   │   ├── components/
│   │   │   │   └── layout/ # Main application layout
│   │   │   ├── guards/     # Route guards
│   │   │   ├── models/     # Data models/interfaces
│   │   │   └── services/   # Core services
│   │   │
│   │   ├── features/       # Feature modules
│   │   │   ├── admin/      # Administrative features
│   │   │   ├── auth/       # Authentication
│   │   │   ├── budget/     # Budget management
│   │   │   ├── dashboard/  # Dashboard components
│   │   │   └── hardware/   # Hardware management
│   │   │
│   │   └── shared/         # Shared components, directives, and pipes
│   │
│   ├── assets/             # Static assets
│   └── styles.scss         # Global styles
```

### Backend Structure
```
backend/
├── src/
│   ├── config/             # Configuration files
│   ├── auth/               # Authentication module
│   ├── users/              # User management module
│   ├── entities/           # Entity management module
│   ├── devices/            # Device inventory module
│   ├── budgets/            # Budget management module
│   ├── common/             # Shared utilities, guards, and decorators
│   ├── app.module.ts       # Main application module
│   └── main.ts             # Application entry point
├── test/                   # Test files
└── .env                    # Environment configuration
```

## Getting Started

### Prerequisites
- Node.js (v18+)
- npm (v6+)
- PostgreSQL (v12+)

### Installation

#### Frontend
1. Navigate to the frontend directory:
   ```
   cd frontend
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Start the development server:
   ```
   npm run start
   ```

4. Open your browser and navigate to `http://localhost:4200`

#### Backend
1. Navigate to the backend directory:
   ```
   cd backend
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Create and configure the .env file:
   ```
   cp .env.example .env
   ```

4. Run the application:
   ```
   npm run start:dev
   ```

5. The API will be available at `http://localhost:3000/api`

## Development

### Code Style and Conventions

#### Frontend
- Follow Angular style guide recommendations
- Use TypeScript strict mode
- Implement lazy loading for feature modules
- Maintain responsive design principles

#### Backend
- Follow NestJS best practices
- Use TypeScript decorators for metadata
- Write comprehensive unit and e2e tests
- Document API endpoints with Swagger/OpenAPI

### Building for Production

#### Frontend
```
npm run build
```

This will generate production-ready files in the `dist/` directory.

#### Backend
```
npm run build
npm run start:prod
```

This will generate compiled JavaScript in the `dist/` directory and run the production server.

## Key Components

### Frontend Components
- **Layout Component**: Application shell with responsive navigation
- **Dashboard Widgets**: Budget overview, device status, notifications, EOL warnings
- **Hardware Management**: Inventory views for different device types
- **Administrative Tools**: User management, entity management, audit logs

### Backend Components
- **Controllers**: API endpoints for frontend communication
- **Services**: Business logic implementation
- **Repositories**: Database access through TypeORM
- **Guards & Interceptors**: Authentication, authorization, and request handling

## API Documentation

The backend API is documented using Swagger UI. When running the backend, you can access the API documentation at:

```
http://localhost:3000/api/docs
```

## Future Enhancements

- Enhanced reporting capabilities
- Integration with procurement systems
- Mobile application support
- Advanced analytics dashboard
- Automated inventory reconciliation
- Containerization with Docker
- CI/CD pipeline implementation

## License

[Include appropriate license information]

## Contact

[Your organization contact information] 