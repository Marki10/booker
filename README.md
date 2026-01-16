# Booker - Booking App

A modern, responsive booking application built with React, TypeScript, and Tailwind CSS.

## 🚀 Live Demo

Try the app live at: **[https://marki10.github.io/booker/](https://marki10.github.io/booker/)**

## Features

- 📅 **Calendar View** - Visual calendar interface to browse bookings by date
- 📋 **List View** - Clean list view of all bookings
- ➕ **Create Bookings** - Easy booking creation with form validation
- ✏️ **Edit Bookings** - Update existing bookings
- 🗑️ **Delete Bookings** - Remove bookings with confirmation
- 🔍 **Date Filtering** - Filter bookings by specific dates
- ✅ **Availability Checking** - Automatic time slot conflict detection
- 🎨 **Modern UI** - Beautiful gradient design with smooth animations
- 📱 **Responsive** - Works perfectly on desktop, tablet, and mobile

## Tech Stack

- **React 19** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **Tailwind CSS 4** - Styling
- **Lucide React** - Icons
- **Framer Motion** - Animations (available but not currently used)

## Getting Started

### Prerequisites

- Node.js 18+ (20.19+ recommended)
- npm or yarn

### Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd booker
```

2. Install dependencies:

```bash
npm install
```

3. Start the development server:

```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

### Building for Production

```bash
npm run build
```

The production build will be in the `dist` directory.

### Deploying to GitHub Pages

```bash
npm run deploy
```

This will build the project and deploy it to the `gh-pages` branch. The site will be available at `https://YOUR_USERNAME.github.io/booker/`

### Preview Production Build

```bash
npm run preview
```

## Project Structure

```
booker/
├── src/
│   ├── components/        # UI components (AppHeader, FormModal, BookingsView, DateFilter, ...)
│   ├── controllers/       # UI controllers (state + handlers)
│   │   └── useAppController.ts
│   ├── hooks/             # Reusable hooks
│   │   └── useBookings.ts
│   ├── services/          # Domain/business logic and integrations
│   │   ├── bookingService.ts
│   │   ├── storageService.ts
│   │   └── apiService.ts
│   ├── types/             # TypeScript types
│   │   └── booking.ts
│   ├── utils/             # Utility functions
│   │   └── bookingUtils.ts
│   ├── App.tsx            # Main app component (thin, uses controller)
│   ├── main.tsx           # Entry point
│   └── index.css          # Global styles
├── public/               # Static assets
├── example/              # Backend and AWS deployment examples
│   ├── backend/          # Node.js/Express backend
│   └── aws/              # AWS deployment configurations
└── README.md
```

## Architecture

- **Controller pattern**: UI state and event handlers live in controllers, keeping components presentational.
  - `useAppController` centralizes app UI state like `showForm`, `editingBooking`, `selectedDate`, `viewMode` and exposes actions such as `handleFormSubmit`, `handleEditBooking`, `handleDeleteBooking`, and `syncWithBackend`.
- **Domain logic**: Encapsulated in services.
  - `bookingService` manages CRUD, conflict checks, and sync orchestration.
  - `storageService` persists data in `localStorage`.
  - `apiService` (optional) integrates with a backend when available.
- **Data flow**:
  1. Components render and forward user events to the controller.
  2. The controller calls hooks/services.
  3. `useBookings` loads from `storageService` and optionally triggers `bookingService.syncWithBackend`.
  4. UI updates via React state.

## Usage

### Creating a Booking

1. Click the "New Booking" button
2. Fill in the form:
   - Name (required)
   - Email (required, validated)
   - Date (required, future dates only)
   - Time (required, 9:00 AM - 5:00 PM)
   - Duration (15-480 minutes)
   - Notes (optional)
3. Click "Create Booking"

### Editing a Booking

1. Click the "Edit" button on any booking card
2. Modify the booking details
3. Click "Update Booking"

### Deleting a Booking

1. Click the "Delete" button on any booking card
2. Confirm the deletion

### Viewing Bookings

- **List View**: See all bookings in a list format
- **Calendar View**: Browse bookings by date on a calendar
- **Date Filter**: Click on a date in the calendar to filter bookings

## Backend Integration

- The app is **localStorage-first** via `storageService`. It works fully offline without a backend.
- If a backend is configured (see `apiService`), the app can:
  - Check backend availability on startup.
  - Manually sync via the header "Sync" action (`syncWithBackend`).
  - Auto-attempt background syncs after CRUD operations when the backend is available.
- `syncStatus` (from the controller/hook) exposes `lastSync`, `pendingSync`, and `backendAvailable` for UI.

See the `example/backend/` directory for a sample backend and `example/aws/` for deployment references.

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run predeploy` - Build project before deployment
- `npm run deploy` - Deploy to GitHub Pages
- `npm run lint` - Run ESLint
- `npm run test` - Run unit tests (Vitest)
- `npm run test:e2e` - Run Cypress E2E headless
- `npm run test:e2e:open` - Open Cypress runner

## Testing

### Unit tests (Vitest)

- Run once: `npm run test`
- Watch mode: `npm run test:watch`
- Coverage: `npm run test:coverage`

### E2E tests (Cypress)

- Headless: `npm run test:e2e`
- Interactive: `npm run test:e2e:open`
- When running interactively, ensure the dev server is up at `http://localhost:5173` (Cypress will launch it automatically if configured via dev server). If not, start it with `npm run dev`.

#### Conventions used in tests

- **data-testid**: Stable selectors are added across the UI (e.g. `booking-form-name`, `booking-item`, `view-mode-list`).
- **State reset**: Custom Cypress command `cy.resetApp()` clears app storage keys (`booker_bookings`, `booker_sync_meta`) and seeds empty state before each test.
- **Dynamic dates**: Tests use `cypress/support/testData.ts` helpers to generate future dates to avoid collisions.

#### Troubleshooting E2E

- **Booking conflicts**: The app checks local availability. Edits exclude the current booking’s ID to avoid self-conflict.
- **Modal assertions**: Prefer asserting list content after actions instead of requiring the modal to be removed from the DOM. Some modals remain mounted but hidden.
- **HTML5 validation**: Native validation is disabled (`noValidate` on the form, `formNoValidate` on submit) so custom error elements (e.g. `booking-form-date-error`) render and can be asserted.
- **Date inputs**: For `type="date"`, programmatic value set plus `input/change/blur` events is the most reliable way to set past/future dates in tests.

## Environment Variables

Create a `.env` file in the root directory for environment-specific configuration:

```env
VITE_API_URL=http://localhost:3000/api
```

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License.

## Acknowledgments

- [React](https://react.dev/)
- [Vite](https://vite.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Lucide Icons](https://lucide.dev/)
