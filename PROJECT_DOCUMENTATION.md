# Booking App - Project Documentation

## Table of Contents
1. [Project Overview](#project-overview)
2. [Technology Stack](#technology-stack)
3. [Architecture & Design Patterns](#architecture--design-patterns)
4. [Key Features](#key-features)
5. [Project Structure](#project-structure)
6. [Core Functionality](#core-functionality)
7. [Data Management](#data-management)
8. [State Management](#state-management)
9. [Performance Optimizations](#performance-optimizations)
10. [Deployment](#deployment)
11. [Testing Strategy](#testing-strategy)
12. [Challenges & Solutions](#challenges--solutions)
13. [Future Enhancements](#future-enhancements)

---

## Project Overview

**Booking App** is a modern, full-stack web application for managing appointments and bookings. Built with Next.js 15 and React 19, it provides an intuitive interface for creating, viewing, editing, and deleting bookings with real-time availability checking.

### Key Highlights
- **Type-safe** application using TypeScript
- **Offline-first** architecture with localStorage persistence
- **Progressive enhancement** with backend synchronization
- **Mobile-responsive** design with Tailwind CSS
- **Static Site Generation (SSG)** for optimal performance
- **Component-based** architecture for maintainability

---

## Technology Stack

### Frontend Framework
- **Next.js 15** - React framework with App Router
  - Server-side rendering (SSR) and static site generation (SSG)
  - Built-in routing and optimization
  - API routes support

### Core Technologies
- **React 19** - UI library with hooks
- **TypeScript** - Type-safe JavaScript
- **Tailwind CSS 4** - Utility-first CSS framework
- **Lucide React** - Icon library

### Development Tools
- **ESLint** - Code linting
- **Prettier** - Code formatting
- **Husky** - Git hooks
- **Vitest** - Unit testing framework

### Deployment
- **GitHub Pages** - Static site hosting
- **gh-pages** - Deployment automation

---

## Architecture & Design Patterns

### 1. Component-Based Architecture
The application follows a modular component structure:
- **Presentational Components**: UI-only components (Footer, Header, etc.)
- **Container Components**: Components with business logic (BookingForm, BookingList)
- **Layout Components**: Page structure components (AppHeader, FormModal)

### 2. Custom Hooks Pattern
Business logic is extracted into reusable hooks:
- `useBookings` - Manages booking CRUD operations and sync state
- `useAppController` - Centralizes UI state and event handlers

### 3. Service Layer Pattern
Separation of concerns with dedicated services:
- `bookingService` - Core booking business logic
- `storageService` - localStorage abstraction
- `apiService` - Backend API communication

### 4. Repository Pattern
Data access is abstracted through service layers, allowing easy switching between localStorage and backend APIs.

### 5. Static Site Generation (SSG)
- About and Contact pages are pre-rendered at build time
- Main app page uses client-side rendering for interactivity
- Optimal performance with minimal server requirements

---

## Key Features

### 1. Booking Management
- **Create**: Add new bookings with validation
- **Read**: View bookings in list or calendar view
- **Update**: Edit existing bookings
- **Delete**: Remove bookings with confirmation

### 2. Availability Checking
- Real-time time slot availability validation
- Prevents double-booking
- Visual calendar highlighting

### 3. Offline-First Architecture
- Data persisted in localStorage
- Works without internet connection
- Automatic sync when backend is available

### 4. Responsive Design
- Mobile-first approach
- Touch-friendly interactions
- Adaptive layouts for all screen sizes

### 5. Multiple View Modes
- **List View**: Chronological list of bookings
- **Calendar View**: Visual calendar with date selection

### 6. Form Validation
- Client-side validation
- Real-time error feedback
- Prevents invalid submissions

---

## Project Structure

```
booker/
├── app/                          # Next.js App Router
│   ├── about/                    # About page (SSG)
│   ├── contact/                 # Contact page (SSG)
│   ├── layout.tsx               # Root layout
│   ├── page.tsx                 # Main app page
│   └── not-found.tsx            # 404 page
├── src/
│   ├── components/              # React components
│   │   ├── AppHeader/           # Application header
│   │   ├── BookingCalendar/    # Calendar view
│   │   ├── BookingForm/        # Booking form
│   │   ├── BookingList/        # List view
│   │   ├── Footer/             # Footer component
│   │   └── ...
│   ├── controllers/            # UI controllers
│   │   └── useAppController.ts # Main app controller hook
│   ├── hooks/                   # Custom React hooks
│   │   └── useBookings.ts      # Bookings management hook
│   ├── services/                # Business logic services
│   │   ├── bookingService.ts   # Booking operations
│   │   ├── storageService.ts   # localStorage wrapper
│   │   └── apiService.ts       # Backend API client
│   ├── types/                   # TypeScript types
│   │   └── booking.ts          # Booking type definitions
│   └── utils/                   # Utility functions
│       ├── dateUtils.ts        # Date/time helpers
│       ├── validation.ts       # Form validation
│       └── generateSampleBookings.ts
├── example/                     # Backend examples
├── .husky/                      # Git hooks
└── public/                      # Static assets
```

---

## Core Functionality

### Booking Service (`bookingService.ts`)
The core service handles all booking operations:

```typescript
// Key methods:
- getAllBookings() - Retrieve all bookings
- createBooking(data) - Create new booking
- updateBooking(id, data) - Update existing booking
- deleteBooking(id) - Delete booking
- checkAvailability(date, time, duration) - Validate time slots
- syncWithBackend() - Sync with remote API
```

**Features:**
- In-memory cache for fast access
- localStorage persistence
- Backend synchronization
- Conflict detection and resolution

### Storage Service (`storageService.ts`)
Abstraction layer for localStorage:

- Type-safe storage operations
- Error handling for quota exceeded
- SSR-safe (checks for `window` object)
- Sync metadata tracking

### API Service (`apiService.ts`)
Mock backend API client:

- RESTful API interface
- Request timeout handling
- Error handling and retries
- Health check endpoint

---

## Data Management

### Data Flow
1. **Initial Load**: Data loaded from localStorage (instant)
2. **Backend Sync**: Attempts to sync with backend if available
3. **User Actions**: Changes saved to localStorage immediately
4. **Background Sync**: Queued sync operations when backend is offline

### Data Persistence Strategy
- **Primary**: localStorage (always available)
- **Secondary**: Backend API (when available)
- **Sync Strategy**: Optimistic updates with conflict resolution

### Sync Status Tracking
```typescript
{
  lastSync: string | null;
  lastSyncId: string | null;
  pendingSync: boolean;
  backendAvailable: boolean;
}
```

---

## State Management

### Local State (React Hooks)
- `useState` for component-level state
- `useCallback` for memoized functions
- `useEffect` for side effects

### Global State Pattern
- Custom hooks (`useBookings`, `useAppController`) manage shared state
- Props drilling minimized through hook composition
- No external state management library needed

### State Updates Flow
```
User Action → Event Handler → Service Method → State Update → UI Re-render
```

---

## Performance Optimizations

### 1. Code Splitting
- Next.js automatic code splitting
- Dynamic imports for heavy components
- Route-based splitting

### 2. Static Generation
- About and Contact pages pre-rendered
- Reduced server load
- Faster page loads

### 3. Memoization
- `useCallback` for event handlers
- `useMemo` for expensive computations
- Prevents unnecessary re-renders

### 4. Optimistic Updates
- UI updates immediately
- Background sync handles persistence
- Better perceived performance

### 5. Lazy Loading
- Components loaded on demand
- Reduced initial bundle size

---

## Deployment

### GitHub Pages Deployment
1. **Build Process**: `npm run build`
   - Generates static files in `out/` directory
   - Creates `.nojekyll` file for GitHub Pages

2. **Deployment**: `npm run deploy`
   - Pushes `out/` to `gh-pages` branch
   - GitHub Pages serves from `gh-pages` branch

3. **Configuration**:
   - `basePath: '/booker'` in `next.config.js`
   - `trailingSlash: true` for proper routing
   - Custom 404 page for GitHub Pages

### Environment Variables
- `NEXT_PUBLIC_API_URL` - Backend API URL (optional)

---

## Testing Strategy

### Unit Tests
- Service layer tests (`bookingService.test.ts`)
- API service tests (`apiService.test.ts`)
- Utility function tests

### Test Framework
- **Vitest** - Fast unit test runner
- Test coverage reporting
- Mock implementations for external dependencies

### Testing Approach
- Test business logic in isolation
- Mock external dependencies (localStorage, fetch)
- Test error scenarios and edge cases

---

## Challenges & Solutions

### Challenge 1: Offline-First Architecture
**Problem**: Application needs to work without internet connection.

**Solution**:
- Implemented localStorage as primary data store
- Created abstraction layer (`storageService`)
- Background sync when backend available
- Optimistic updates for better UX

### Challenge 2: Preventing Duplicate Bookings
**Problem**: Sample bookings were regenerated on every page reload.

**Solution**:
- Used `useRef` to track initialization state
- Check localStorage directly before generating samples
- Only generate on first load when storage is empty

### Challenge 3: Next.js Static Export with Dev Server
**Problem**: `output: 'export'` conflicts with dev server.

**Solution**:
- Removed `output: 'export'` from dev config
- Static export only during production builds
- Dev server works normally for development

### Challenge 4: GitHub Pages Routing
**Problem**: 404 errors on direct page access.

**Solution**:
- Configured `basePath` and `trailingSlash`
- Created custom 404 page with redirect
- Added `.nojekyll` file to prevent Jekyll processing

### Challenge 5: Type Safety with Server Components
**Problem**: Event handlers can't be passed to server components.

**Solution**:
- Separated server and client components
- Used `"use client"` directive appropriately
- Removed event handlers from SSG pages

### Challenge 6: Git Hooks on Windows/WSL
**Problem**: Husky hooks failing due to WSL path issues.

**Solution**:
- Added proper shebang lines to hooks
- Configured `.gitattributes` for LF line endings
- Made hooks more resilient with error handling

---

## Future Enhancements

### Short-term
1. **Backend Integration**: Connect to real API
2. **Form Submission**: Implement contact form backend
3. **User Authentication**: Add login/signup
4. **Email Notifications**: Send booking confirmations

### Medium-term
1. **Real-time Updates**: WebSocket integration
2. **Advanced Filtering**: Search and filter bookings
3. **Recurring Bookings**: Support for recurring appointments
4. **Calendar Integration**: Sync with Google Calendar, Outlook

### Long-term
1. **Multi-user Support**: Team/organization features
2. **Analytics Dashboard**: Booking statistics and insights
3. **Mobile App**: React Native version
4. **Internationalization**: Multi-language support

---

## Interview Talking Points

### Technical Decisions

**Why Next.js?**
- Server-side rendering for better SEO
- Static site generation for performance
- Built-in routing and optimization
- Great developer experience

**Why TypeScript?**
- Type safety catches errors early
- Better IDE support and autocomplete
- Self-documenting code
- Easier refactoring

**Why Custom Hooks?**
- Reusable business logic
- Separation of concerns
- Easier testing
- No need for external state management

**Why localStorage First?**
- Works offline immediately
- Better user experience
- Progressive enhancement
- Fallback when backend unavailable

### Architecture Highlights

1. **Separation of Concerns**: Clear boundaries between UI, business logic, and data access
2. **Testability**: Services and utilities are easily testable in isolation
3. **Scalability**: Component-based architecture allows easy feature additions
4. **Maintainability**: Well-organized code structure with clear responsibilities

### Problem-Solving Examples

1. **Offline Support**: Implemented localStorage with sync mechanism
2. **Performance**: Used SSG and code splitting
3. **Type Safety**: Comprehensive TypeScript types throughout
4. **User Experience**: Optimistic updates and instant feedback

### Best Practices Demonstrated

- ✅ TypeScript for type safety
- ✅ Component composition
- ✅ Custom hooks for reusable logic
- ✅ Error handling and validation
- ✅ Responsive design
- ✅ Accessibility considerations
- ✅ Git hooks for code quality
- ✅ Documentation and comments

---

## Quick Start Guide

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation
```bash
npm install
```

### Development
```bash
npm run dev
# Open http://localhost:3000/booker/
```

### Build
```bash
npm run build
# Output in out/ directory
```

### Deploy
```bash
npm run deploy
# Deploys to GitHub Pages
```

---

## Conclusion

This Booking App demonstrates modern web development practices with:
- **Clean Architecture**: Well-organized, maintainable code
- **Type Safety**: Full TypeScript implementation
- **Performance**: Optimized with SSG and code splitting
- **User Experience**: Offline-first, responsive design
- **Best Practices**: Testing, linting, and Git hooks

The project showcases ability to build production-ready applications with attention to code quality, user experience, and maintainability.

---

**Live Demo**: [https://marki10.github.io/booker/](https://marki10.github.io/booker/)

**Repository**: [GitHub Repository](https://github.com/Marki10/booker)
