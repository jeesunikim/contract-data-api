# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

This project uses pnpm as the package manager:

- **Install dependencies**: `pnpm install`
- **Development**:
  - `pnpm dev` - Run development server with nodemon
  - `pnpm dev:watch` - Run with file watching
  - `pnpm build` - Build TypeScript to JavaScript
  - `pnpm start` - Run production server
  - `pnpm typecheck` - Run TypeScript type checking
- **Database operations**:
  - Generate Prisma client: `pnpm prisma:generate` or `npx prisma generate`
  - Run migrations: `pnpm migrate` or `npx prisma migrate dev`
  - Deploy migrations: `npx prisma migrate deploy`
  - Reset database: `npx prisma migrate reset`
  - View database: `pnpm prisma:studio` or `npx prisma studio`

## Architecture Overview

This is a Node.js API project using Express.js and Prisma ORM with the following structure:

### Core Technologies

- **Framework**: Express.js 5.1.0
- **Database ORM**: Prisma 6.12.0 with PostgreSQL
- **Package Manager**: pnpm (lockfile present)

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
2. Run `pnpm install` to install dependencies
3. Run `pnpm prisma:generate` to generate the Prisma client
4. Create or run database migrations with `pnpm migrate` ([documentation](https://www.prisma.io/docs/orm/prisma-migrate/understanding-prisma-migrate/mental-model#track-your-migration-history-with-prisma-migrate-dev))
5. Start development server with `pnpm dev`
