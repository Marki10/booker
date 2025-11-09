# Booker - Booking App

A modern, responsive booking application built with React, TypeScript, and Tailwind CSS.

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

### Preview Production Build

```bash
npm run preview
```

## Project Structure

```
booker/
├── src/
│   ├── components/       # React components
│   │   ├── BookingForm.tsx
│   │   ├── BookingList.tsx
│   │   └── BookingCalendar.tsx
│   ├── services/         # Business logic
│   │   └── bookingService.ts
│   ├── types/            # TypeScript types
│   │   └── booking.ts
│   ├── utils/            # Utility functions
│   │   ├── dateUtils.ts
│   │   └── validation.ts
│   ├── App.tsx           # Main app component
│   ├── main.tsx          # Entry point
│   └── index.css         # Global styles
├── public/               # Static assets
├── example/              # Backend and AWS deployment examples
│   ├── backend/          # Node.js/Express backend
│   └── aws/              # AWS deployment configurations
└── README.md
```

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

The app currently uses in-memory storage. To integrate with a backend API, see the [Frontend Integration Guide](example/frontend-integration.md).

Example backend implementations and AWS deployment configurations are available in the `example/` directory.

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

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
