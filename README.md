# Contract Data API

A Node.js REST API for managing contract data using Express.js and Prisma ORM with PostgreSQL.

## Prerequisites

- Node.js (v16 or higher)
- Yarn package manager
- PostgreSQL database

## Setup

### 1. **Install dependencies**

```bash
yarn install

```

### 2. Environment Configuration

#### Create .env file with your database connection

`DATABASE_URL="postgresql://username:password@localhost:5432/contract_data"`

### 3. Database Setup

#### Generate Prisma client

`npx prisma generate`

#### Run database migrations

`npx prisma migrate dev`

### 4. Start the API

`node src/index.js`

#### Database Commands

- View database: npx prisma studio
- Reset database: npx prisma migrate reset
- Deploy migrations: npx prisma migrate deploy

#### API Endpoints

- GET /contract-data - Retrieve contract data

Project Structure

src/
├── controllers/ # Route handlers
├── routes/ # API routes
├── utils/ # Utility functions
└── index.ts # Main application entry

prisma/
├── schema.prisma # Database schema
└── migrations/ # Database migrations

Technology Stack

- Framework: Express.js 5.1.0
- Database: PostgreSQL with Prisma ORM 6.12.0
- Language: TypeScript
- Package Manager: Yarn
