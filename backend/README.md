# TRT Portal Backend

This is the backend for the Technology Refresh Tool (TRT) Portal, built with NestJS and TypeORM.

## Prerequisites

- Node.js (v18+)
- PostgreSQL

## Installation

```bash
# Install dependencies
npm install

# Create a .env file based on .env.example
cp .env.example .env
```

## Configuration

Edit the `.env` file with your database credentials and other settings.

## Running the app

```bash
# Development mode
npm run start:dev

# Production mode
npm run build
npm run start:prod
```

## API Documentation

The API documentation is available via Swagger UI at:

```
http://localhost:3000/api/docs
```

This provides an interactive interface to explore and test all available endpoints.

## API Endpoints

The API is structured around the following resources:

- `/api/auth` - Authentication endpoints
- `/api/users` - User management
- `/api/entities` - Entities (Owner/Operators)
- `/api/devices` - Device inventory
- `/api/budgets` - Budget management

## Database Schema

The database includes the following main entities:

- Users - Authentication and authorization
- Entities - Owner/Operators and organizational hierarchy
- Devices - Hardware inventory tracking
- Budgets - Financial planning and tracking

## Development

```bash
# Run tests
npm test

# Lint code
npm run lint
``` 