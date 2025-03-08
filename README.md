<!-- TOC start (generated with https://github.com/derlin/bitdowntoc) -->

- [Currency Conversion Service](#currency-conversion-service)
  - [Getting Started](#getting-started)
    - [Prerequisites](#prerequisites)
    - [Installation](#installation)
    - [Database Setup](#database-setup)
    - [Running the Application](#running-the-application)
    - [API Usage Examples](#api-usage-examples)
  - [Project Overview](#project-overview)
  - [Key Features](#key-features)
  - [Technical Highlights](#technical-highlights)
    - [Architecture](#architecture)
    - [Dependency Inversion](#dependency-inversion)
    - [Value Objects](#value-objects)
    - [Testability](#testability)
  - [Technical Decisions](#technical-decisions)
    - [Exchange Rate API Adaptation](#exchange-rate-api-adaptation)
    - [Configuration Management](#configuration-management)
    - [Error Handling](#error-handling)
    - [Numeric Precision for Financial Calculations](#numeric-precision-for-financial-calculations)

<!-- TOC end -->

> AI assisted README

<!-- TOC --><a name="currency-conversion-service"></a>

# Currency Conversion Service

A Domain-Driven Design implementation of a currency conversion service built with TypeScript, express.js, PostgreSQL and Redis.
It leverages Domain-Driven Design and following hexagonal architecture principles.

<!-- TOC --><a name="getting-started"></a>

## Getting Started

Follow these steps to set up and run the Currency Conversion Service locally.

<!-- TOC --><a name="prerequisites"></a>

### Prerequisites

- Node.js 16+ and npm
- PostgreSQL database
- Redis (for caching exchange rates)
- [Fixer.io](<(https://fixer.io/)>) API key

<!-- TOC --><a name="installation"></a>

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/JuanDArdilaG/currency-conversion-service.git
   cd currency-conversion-service
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Set up environment variables:

   Copy the example environment file:

   ```bash
   cp .env.example .env
   ```

   Edit the `.env` file with your configuration values:

   ```
   # API server
   PORT=3000

   # PostgreSQL Database
   DB_HOST=localhost
   DB_PORT=5432
   DB_USER=postgres
   DB_PASSWORD=yourpassword
   DB_NAME=currency_conversion

   # Redis
   REDIS_HOST=localhost
   REDIS_PORT=6379
   REDIS_USERNAME=
   REDIS_PASSWORD=
   REDIS_KEY_PREFIX=currency:

   # Fixer.io API
   FIXER_API_KEY=your_api_key_here
   FIXER_CACHE_EXPIRATION_MINUTES=60
   ```

<!-- TOC --><a name="database-setup"></a>

### Database Setup

1. Create your PostgreSQL database.
2. Run the SQL script in the `tables_creation.sql` file to create the necessary tables.

<!-- TOC --><a name="running-the-application"></a>

### Running the Application

Start the development server:

```bash
npm run dev
```

The API will be available at `http://localhost:3000` (or your configured port).

<!-- TOC --><a name="api-usage-examples"></a>

### API Usage Examples

See the Postman collection (`docs/postman-collection.json`).

<!-- TOC --><a name="project-overview"></a>

## Project Overview

This project demonstrates a clean architecture approach to building a currency conversion service. It handles currency exchange rate fetching and caching, conversion calculations, and maintains a history of conversions per user.

<!-- TOC --><a name="key-features"></a>

## Key Features

- **Currency Conversion**: Convert between currencies.
- **Exchange Rate Service**: Integration with Fixer.io API for current rates.
- **Caching**: Redis-based caching for exchange rates to minimize API calls.
- **Conversion History**: Track and retrieve user conversion history.

<!-- TOC --><a name="technical-highlights"></a>

## Technical Highlights

<!-- TOC --><a name="architecture"></a>

### Architecture

The project follows Domain-Driven Design and Hexagonal Architecture (Ports and Adapters) patterns:

- **Domain Layer**: Contains business rules and logic
- **Application Layer**: Orchestrates use cases using domain services
- **Infrastructure Layer**: Implements adapters for external services, cache and persistence

<!-- TOC --><a name="dependency-inversion"></a>

### Dependency Inversion

All dependencies point inward:

- Domain layer defines interfaces (ports)
- Infrastructure adapters implement these interfaces
- Dependencies are injected using a DI container ([Awilix](https://www.npmjs.com/package/awilix))

<!-- TOC --><a name="value-objects"></a>

### Value Objects

Rich domain modeling with value objects for concepts like:

- `Currency`
- `Money`
- `ExchangeRate`

<!-- TOC --><a name="testability"></a>

### Testability

The architecture prioritizes testability:

- Clean separation of concerns facilitates unit testing
- Domain logic is isolated from external dependencies
- Interfaces and dependency injection enable easy mocking

<!-- TOC --><a name="technical-decisions"></a>

## Technical Decisions

<!-- TOC --><a name="exchange-rate-api-adaptation"></a>

### Exchange Rate API Adaptation

The solution handles the constraints of Fixer.io's free tier (fixed EUR base currency) by:

1. Direct conversion when EUR is involved
2. Cross-rate calculation for non-EUR currency pairs
3. Caching to minimize API calls

<!-- TOC --><a name="configuration-management"></a>

### Configuration Management

Flexible configuration through:

1. Default environment-based configuration
2. Configuration object validation (using [Zod](https://www.npmjs.com/package/zod))
3. Dependency injection of configuration

<!-- TOC --><a name="error-handling"></a>

### Error Handling

The project implements a domain-centric error handling approach:

1. **Domain-Pure Errors**: Error types defined in the domain layer without infrastructure dependencies (HTTP status codes, etc.)
2. **Error Type System**: Structured error hierarchy with domain-specific error types
3. **Consistent Error Responses**: Standardized error response format with type, message, and contextual details

<!-- TOC --><a name="numeric-precision-for-financial-calculations"></a>

### Numeric Precision for Financial Calculations

The project uses [big.js](https://www.npmjs.com/package/big.js) for handling currency conversion calculations:

1. **Floating-Point Precision**: Avoids JavaScript's native floating-point precision issues in financial calculations
2. **Arbitrary Precision**: Maintains exact decimal precision throughout conversion operations
