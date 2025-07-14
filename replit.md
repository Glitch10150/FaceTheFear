# Face the Fear - Gang Application System

## Overview

This is a full-stack web application built for a GTA-style gang called "Face the Fear" that allows users to submit applications to join the organization. The application features a React frontend with a Node.js/Express backend, using PostgreSQL for data persistence via Drizzle ORM.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React with TypeScript
- **Build Tool**: Vite for development and production builds
- **UI Library**: Radix UI components with shadcn/ui styling system
- **Styling**: Tailwind CSS with custom GTA-themed color scheme
- **State Management**: TanStack Query for server state management
- **Routing**: Wouter for client-side routing
- **Forms**: React Hook Form with Zod validation

### Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript with ES modules
- **Database**: PostgreSQL with Drizzle ORM
- **Validation**: Zod schemas for request validation
- **Session Management**: Express sessions with PostgreSQL store
- **Development**: Hot reload with Vite integration

### Database Schema
Single `applications` table with fields:
- User identification (username, discord)
- Application details (experience, role, motivation, previousGroups)
- Availability (JSON array of selected days)
- Status tracking (pending/approved/rejected)
- Timestamps

## Key Components

### Application Form (`client/src/components/application-form.tsx`)
- Multi-step form with validation
- Real-time form state management
- Success/error handling with toast notifications
- Responsive design with GTA-themed styling
- Added "Why should we accept you?" field

### Application Status (`client/src/components/application-status.tsx`)
- Progress tracking for application lifecycle
- Status badge indicators
- Timeline view of application steps

### Admin System
- **Admin Login (`client/src/pages/admin-login.tsx`)** - Secure JWT-based authentication
- **Admin Dashboard (`client/src/pages/admin-dashboard.tsx`)** - Full application management interface
- **Admin Routes** - Protected API endpoints for admin operations
- **Admin Accounts** - Admin 1: Username: `Glitch`, Password: `Glitch56??` | Admin 2: Username: `Beel`, Password: `Beel235??`

### Storage Layer (`server/storage.ts`)
- Interface-based storage abstraction
- PostgreSQL database implementation with Drizzle ORM
- CRUD operations for applications and admin accounts
- Full database persistence with proper schema
- Secure password hashing with bcrypt

### API Routes (`server/routes.ts`)
- RESTful endpoints for application management
- Admin authentication and authorization
- Input validation using Zod schemas
- Error handling middleware
- Status update functionality with admin protection

## Data Flow

1. **Application Submission**: User fills out form → Frontend validation → API request → Backend validation → Database storage
2. **Status Updates**: Admin updates status → Database update → Frontend refetch → UI update
3. **Application Retrieval**: Frontend query → API endpoint → Database query → Response with applications

## External Dependencies

### Frontend Dependencies
- **UI Components**: Radix UI primitives for accessible components
- **Styling**: Tailwind CSS for utility-first styling
- **State Management**: TanStack Query for server state
- **Form Handling**: React Hook Form with Zod resolver
- **Date Utilities**: date-fns for date formatting

### Backend Dependencies
- **Database**: Neon serverless PostgreSQL
- **ORM**: Drizzle ORM with PostgreSQL dialect
- **Validation**: Zod for schema validation
- **Session Store**: connect-pg-simple for PostgreSQL sessions

## Deployment Strategy

### Development
- Vite dev server for frontend with hot reload
- Express server with TypeScript compilation via tsx
- Database migrations handled by Drizzle Kit
- Integrated development environment with error overlays

### Production
- Vite build generates optimized static assets
- Express server bundled with esbuild
- Static file serving from Express
- Environment-based configuration

### Database Setup
- Drizzle migrations in `/migrations` directory
- Schema definitions in `/shared/schema.ts`
- Database URL configured via environment variables
- Push-based schema updates for development

### Build Process
- `npm run build`: Builds both frontend and backend
- `npm run dev`: Starts development server with hot reload
- `npm run db:push`: Pushes schema changes to database
- `npm start`: Runs production server

The application is structured as a monorepo with shared TypeScript types and schemas, enabling type safety across the full stack while maintaining clear separation between frontend and backend concerns.

## Recent Changes: Latest modifications with dates

### January 14, 2025
- Fixed database connection issue by properly configuring DATABASE_URL environment variable
- Successfully deployed application with autoscale hosting (free tier)
- Created and configured admin accounts: Glitch and Beel with working authentication
- Removed beetle admin account per user request
- Updated second admin credentials to Username: "Beel", Password: "Beel235??" - confirmed working
- **Added admin tracking feature**: System now records which admin approved/rejected applications
  - Added `reviewedBy` and `reviewedAt` fields to applications table
  - Updated admin dashboard to display reviewer information
  - Updated application status component to show who made the decision
  - All status changes now track the admin username and timestamp
- Application fully operational at deployment URL with working admin dashboard