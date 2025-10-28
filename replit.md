# Schedule Paysheet

## Overview

Schedule Paysheet is a web-based shift management and payroll calculation application designed for workers to track their work schedules, calculate earnings, and manage special days (vacation, sick leave, etc.). The application provides a monthly calendar view with detailed shift tracking, automatic calculation of base pay, overtime, night shifts, and complementary hours based on configurable hourly rates.

**Core Purpose**: Enable workers to independently manage their shift schedules and automatically calculate their earnings based on customizable work contracts, rates, and shift types.

**Key Features**:
- Google-based authentication with initial setup wizard
- Monthly calendar with customizable views (table/cards)
- Shift management with automatic pay calculations
- Support for night shifts, overtime, complementary hours, and extra shifts
- Special day tracking (vacation, rest days, sick leave)
- CSV/TXT import and export functionality
- Multi-timezone support with Spanish locale formatting
- Theme support (light/dark/system)

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Technology Stack**:
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite (SPA mode)
- **Routing**: Wouter (lightweight client-side routing)
- **Styling**: TailwindCSS with custom design system
- **UI Components**: Radix UI primitives with shadcn/ui configuration
- **State Management**: React Context API for auth/theme, TanStack Query for server state
- **Date Handling**: date-fns with date-fns-tz for timezone operations

**Design System**:
- Hybrid approach combining Linear's clean typography with Material Design components
- Custom spacing system based on Tailwind units
- Inter font for UI, SF Mono for numerical/time displays
- Responsive breakpoints: mobile (<768px), tablet, desktop
- Dark mode support with CSS custom properties

**Application Structure**:
- `/client/src/pages/`: Route components (Welcome, Setup, Home, Shifts, Settings, Import)
- `/client/src/components/`: Reusable components including UI primitives
- `/client/src/contexts/`: Global state (AuthContext, ThemeContext)
- `/client/src/lib/`: Utility modules for calculations, datetime, formatting, Firebase integration

**Key Architectural Decisions**:
- **SPA with Client-Side Routing**: Chosen for immediate navigation and offline-first capability (PWA-ready)
- **Component-Based Architecture**: Radix UI primitives provide accessible, unstyled components that are styled with TailwindCSS
- **Calculation Engine Client-Side**: All payroll calculations happen in the browser (`lib/calc.ts`) to provide instant feedback and work offline
- **Timezone-Aware**: All dates stored in UTC in Firestore, converted to user's timezone for display using date-fns-tz

### Backend Architecture

**Technology Stack**:
- **Runtime**: Node.js with Express.js (minimal server for Vite dev mode and static serving)
- **Database**: Firebase Firestore (NoSQL document database)
- **Authentication**: Firebase Auth with Google OAuth provider

**Server Structure**:
- `/server/index.ts`: Express server setup with Vite middleware in development
- `/server/routes.ts`: API route registration (currently minimal, most logic is client-side)
- `/server/storage.ts`: In-memory storage interface (appears to be template/unused, Firebase used instead)

**Key Architectural Decisions**:
- **Firebase-First Backend**: All data operations use Firebase SDK directly from the client, eliminating the need for a traditional REST API
- **Serverless Approach**: No custom backend logic; Express only serves the built React app in production
- **Client-Side Firebase SDK**: Authentication and database operations happen directly from the browser using Firebase SDK
- **Why Firebase**: Chosen for built-in authentication, real-time capabilities, automatic scaling, and simplified deployment

**Data Model** (defined in `/shared/schema.ts`):
- **UserProfile**: User settings including rates, night window, contract details, timezone, theme
- **Shift**: Individual work shifts with start/end times, breaks, shift type, calculation cache
- **Enums**: DayKind (normal/vacation/sick), ShiftType (generic/complementary/acquired), Theme preferences

**Data Storage Pattern**:
- Firestore collection: `users/{uid}` for user profiles
- Firestore subcollection: `users/{uid}/shifts` for user's shifts
- All dates stored as ISO strings in UTC
- Calculation results cached in `calcCache` field to avoid recalculation

### Calculation Logic

**Pay Calculation Engine** (`lib/calc.ts`):
- **Priority System**: Night rate > Extra rate > Complementary rate > Base rate
- **Minute-by-Minute Classification**: Timeline expansion algorithm classifies each minute of a shift
- **Override Support**: Individual shifts can override global rates or total pay
- **Caching**: Results stored in Firestore to optimize performance on repeat views

**Timezone Handling** (`lib/datetime.ts`):
- User's timezone stored in profile (default: Europe/Madrid)
- All stored times in UTC ISO format
- Display conversion using date-fns-tz
- Handles midnight-crossing shifts correctly

**Special Cases**:
- Non-work days (vacation, sick leave) calculated based on contract averages
- Extra shifts (outside regular schedule) use extra rate
- Complementary hours paid at complementary or base rate
- Manual euro overrides bypass all calculation

### Import/Export System

**Supported Formats** (`lib/import.ts`, `lib/export.ts`):
- CSV import/export with Spanish date formatting
- TXT format for human-readable export
- Summary reports with totals
- Papa Parse library for CSV parsing

**Import Strategies**:
- File-based import with validation
- Date parsing supporting multiple formats
- Midnight-crossing shift detection

## External Dependencies

### Third-Party Services

**Firebase** (Primary Backend):
- **Firebase Auth**: Google OAuth authentication
- **Firestore**: Document database for user profiles and shifts
- **Configuration**: Requires environment variables:
  - `VITE_FIREBASE_API_KEY`
  - `VITE_FIREBASE_PROJECT_ID`
  - `VITE_FIREBASE_APP_ID`
- **Why Firebase**: Provides authentication, real-time database, and hosting in a single platform with generous free tier

### Database

**Firestore Structure**:
```
users/{uid}
  - profile data (rates, settings, contract)
  - subcollection: shifts/{shiftId}
```

**Note**: The repository includes Drizzle configuration (`drizzle.config.ts`) and PostgreSQL setup, but these appear unused in favor of Firebase Firestore. The application may be migrated to or extended with PostgreSQL in the future.

### Key NPM Dependencies

**Core Framework**:
- `react` + `react-dom`: UI framework
- `vite`: Build tool and dev server
- `typescript`: Type safety

**UI & Styling**:
- `tailwindcss`: Utility-first CSS
- `@radix-ui/*`: Accessible UI primitives (20+ components)
- `lucide-react`: Icon library
- `class-variance-authority`: Component variants
- `clsx` + `tailwind-merge`: Conditional className utilities

**Data & State**:
- `@tanstack/react-query`: Server state management and caching
- `firebase`: Firebase SDK (auth, firestore)
- `date-fns` + `date-fns-tz`: Date manipulation and timezone handling

**Forms & Validation**:
- `react-hook-form`: Form state management
- `@hookform/resolvers`: Form validation
- `zod`: Schema validation

**Data Processing**:
- `papaparse`: CSV parsing for imports

**Development**:
- `@replit/vite-plugin-*`: Replit-specific development plugins
- `tsx`: TypeScript execution for development server

### Environment Configuration

Required environment variables (stored in `.env` or Replit Secrets):
- `VITE_FIREBASE_API_KEY`: Firebase API key
- `VITE_FIREBASE_PROJECT_ID`: Firebase project identifier
- `VITE_FIREBASE_APP_ID`: Firebase app identifier
- `DATABASE_URL`: PostgreSQL connection (configured but currently unused)