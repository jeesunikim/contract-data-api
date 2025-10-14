# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

This project uses Yarn as the package manager:

- **Install dependencies**: `yarn install`
- **Development**: No dev script defined in package.json - check if there's an index.js entry point or if scripts need to be added
- **Database operations**:
  - Generate Prisma client: `npx prisma generate`
  - Run migrations: `npx prisma migrate dev`
  - Deploy migrations: `npx prisma migrate deploy`
  - Reset database: `npx prisma migrate reset`
  - View database: `npx prisma studio`

## Architecture Overview

This is a Node.js API project using Express.js and Prisma ORM with the following structure:

### Core Technologies

- **Framework**: Express.js 5.1.0
- **Database ORM**: Prisma 6.12.0 with PostgreSQL
- **Package Manager**: Yarn (lockfile present)

### Directory Structure

```
src/
├── controllers/    # Route handlers and business logic
├── middleware/     # Express middleware functions
├── services/       # Business logic and external API integrations
├── types/          # Type definitions
└── utils/          # Utility functions and helpers

prisma/
└── schema.prisma   # Database schema and configuration
```

### Database

Database comes from Google Cloud SQL via 'cloud-sql-connector'.

### Database Configuration

- **Provider**: PostgreSQL
- **Prisma Client Output**: `../generated/prisma` (custom location)
- **Environment Variable**: `DATABASE_URL` required for database connection

### Key Notes

- The project appears to be in early setup stage with basic structure but no main application files yet
- Prisma client is configured to generate in a custom location (`../generated/prisma`)
- No main entry point or server file is currently present in the src directory
- No testing framework or linting tools are configured yet

### Development Workflow

1. Ensure `DATABASE_URL` environment variable is set
2. Run `yarn install` to install dependencies
3. Run `npx prisma generate` to generate the Prisma client
4. Create or run database migrations with `npx prisma migrate dev` (doc)[https://www.prisma.io/docs/orm/prisma-migrate/understanding-prisma-migrate/mental-model#track-your-migration-history-with-prisma-migrate-dev]
5. The main application entry point needs to be created (likely `src/index.js` or `src/app.js`)
