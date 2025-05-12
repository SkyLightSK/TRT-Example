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

## Environment Configuration

The application uses environment variables for configuration, which are validated using Zod. The main configurations include:

### Server Configuration
- `NODE_ENV` - Environment mode (development, production, test)
- `PORT` - Server port (default: 3000)
- `API_PREFIX` - Global API prefix (default: api)

### Database Configuration
- `DB_HOST` - Database host (default: localhost)
- `DB_PORT` - Database port (default: 5432)
- `DB_USERNAME` - Database username
- `DB_PASSWORD` - Database password
- `DB_DATABASE` - Database name

### Security
- `JWT_SECRET` - Secret key for JWT token generation
- `JWT_EXPIRES_IN` - JWT token expiration (default: 1d)

### CORS Settings
- `CORS_ORIGIN` - Allowed origins for CORS

You can find all these settings in the `.env.example` file. Copy this file to `.env` and adjust the values as needed.

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