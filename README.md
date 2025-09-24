# Contract Data API

A Node.js REST API for managing contract data using Express.js and Prisma ORM with PostgreSQL.

## Prerequisites

- Node.js (v16 or higher)
- Yarn package manager
- PostgreSQL database

## Technology Stack

- Framework: Express.js 5.1.0
- Database: PostgreSQL with Prisma ORM 6.12.0
- Language: TypeScript
- Package Manager: Yarn

## Setup

### 1. **Install dependencies**

```bash
yarn install

```

### 2. Environment Configuration

#### Create .env file with your database connection

`DATABASE_URL="postgresql://username:password@localhost:5432/contract_data"`

### 3. Database Setup

#### Introspect your database with Prisma ORM

`npx prisma db pull`

#### Generate Prisma client

`npx prisma generate`

#### Run database migrations

`npx prisma migrate dev`

### 4. Start the API

`yarn dev`

#### Database Commands

- View database: npx prisma studio
- Reset database: npx prisma migrate reset
- Deploy migrations: npx prisma migrate deploy

#### API Endpoints

- GET /api/mainnet/contract/CDVQVKOY2YSXS2IC7KN6MNASSHPAO7UN2UR2ON4OI2SKMFJNVAMDX6DP/storage - Retrieve contract data

`curl http://localhost:3000/api/{network}/contract/{contract_id}/storage`

- ?sort_by=durability&order=desc - Sort by durability descending
- ?sort_by=ttl&order=asc - Sort by TTL ascending
- ?sort_by=updated_at&order=desc - Sort by updated timestamp descending

#### Project Structure

```
src/
├── controllers/ # Route handlers
├── routes/ # API routes
├── utils/ # Utility functions
└── index.ts # Main application entry

prisma/
├── schema.prisma # Database schema
└── migrations/ # Database migrations
```
