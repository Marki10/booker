# Frontend Integration Guide

This guide shows how to integrate the backend API with the React frontend.

## Update bookingService.ts

Replace the in-memory service with API calls:

```typescript
// src/services/bookingService.ts

import type { Booking, BookingFormData } from "../types/booking";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api";

export const bookingService = {
  // Get all bookings
  getAllBookings: async (): Promise<Booking[]> => {
    const response = await fetch(`${API_URL}/bookings`);
    if (!response.ok) {
      throw new Error("Failed to fetch bookings");
    }
    return response.json();
  },

  // Get booking by ID
  getBookingById: async (id: string): Promise<Booking> => {
    const response = await fetch(`${API_URL}/bookings/${id}`);
    if (!response.ok) {
      throw new Error("Failed to fetch booking");
    }
    return response.json();
  },

  // Create a new booking
  createBooking: async (data: BookingFormData): Promise<Booking> => {
    const response = await fetch(`${API_URL}/bookings`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Failed to create booking");
    }
    return response.json();
  },

  // Update a booking
  updateBooking: async (id: string, data: Partial<BookingFormData>): Promise<Booking> => {
    const response = await fetch(`${API_URL}/bookings/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Failed to update booking");
    }
    return response.json();
  },

  // Delete a booking
  deleteBooking: async (id: string): Promise<void> => {
    const response = await fetch(`${API_URL}/bookings/${id}`, {
      method: "DELETE",
    });
    if (!response.ok) {
      throw new Error("Failed to delete booking");
    }
  },

  // Get bookings for a specific date
  getBookingsByDate: async (date: string): Promise<Booking[]> => {
    const response = await fetch(`${API_URL}/bookings/date/${date}`);
    if (!response.ok) {
      throw new Error("Failed to fetch bookings");
    }
    return response.json();
  },

  // Check if a time slot is available
  isTimeSlotAvailable: async (date: string, time: string, duration: number, excludeBookingId?: string): Promise<boolean> => {
    const response = await fetch(`${API_URL}/bookings/availability`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        date,
        time,
        duration,
        excludeBookingId,
      }),
    });
    if (!response.ok) {
      throw new Error("Failed to check availability");
    }
    const data = await response.json();
    return data.available;
  },
};
```

## Update App.tsx

Update the App component to handle async operations:

```typescript
// src/App.tsx

import { useState, useEffect } from 'react'
import type { Booking, BookingFormData } from './types/booking'
import { bookingService } from './services/bookingService'
// ... other imports

function App() {
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  // ... other state

  useEffect(() => {
    loadBookings()
  }, [])

  const loadBookings = async () => {
    try {
      setLoading(true)
      setError(null)
      const allBookings = await bookingService.getAllBookings()
      setBookings(allBookings)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load bookings')
      console.error('Error loading bookings:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleCreateBooking = async (formData: BookingFormData) => {
    try {
      await bookingService.createBooking(formData)
      await loadBookings()
      setShowForm(false)
      setEditingBooking(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create booking')
    }
  }

  const handleUpdateBooking = async (formData: BookingFormData) => {
    if (editingBooking) {
      try {
        await bookingService.updateBooking(editingBooking.id, formData)
        await loadBookings()
        setShowForm(false)
        setEditingBooking(null)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to update booking')
      }
    }
  }

  const handleDeleteBooking = async (id: string) => {
    if (confirm('Are you sure you want to delete this booking?')) {
      try {
        await bookingService.deleteBooking(id)
        await loadBookings()
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to delete booking')
      }
    }
  }

  // ... rest of component

  return (
    <div className="min-h-screen">
      {/* Add error display */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
          <span className="block sm:inline">{error}</span>
          <button
            onClick={() => setError(null)}
            className="absolute top-0 bottom-0 right-0 px-4 py-3"
          >
            ×
          </button>
        </div>
      )}

      {/* Add loading state */}
      {loading && (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <p className="mt-2 text-gray-600">Loading bookings...</p>
        </div>
      )}

      {/* ... rest of JSX */}
    </div>
  )
}
```

## Environment Variables

Create a `.env` file in the frontend root:

```env
VITE_API_URL=http://localhost:3000/api
```

For production:

```env
VITE_API_URL=https://your-api-domain.com/api
```

## CORS Configuration

Make sure the backend CORS is configured to allow your frontend URL:

```javascript
// backend/src/index.js
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true,
  }),
);
```

## Error Handling

Add error handling in the BookingForm component:

```typescript
// src/components/BookingForm.tsx

const handleSubmit = async (e: FormEvent) => {
  e.preventDefault();
  setErrors({});

  // ... validation

  try {
    // Check availability
    const available = await bookingService.isTimeSlotAvailable(formData.date, formData.time, formData.duration, initialData ? "existing" : undefined);

    if (!available) {
      setErrors({
        time: "This time slot is already booked. Please choose another time.",
      });
      return;
    }

    onSubmit(formData);
  } catch (err) {
    setErrors({
      time: err instanceof Error ? err.message : "Failed to check availability",
    });
  }
};
```

## Testing

1. Start the backend server:

   ```bash
   cd example/backend
   npm install
   npm run dev
   ```

2. Update frontend `.env`:

   ```env
   VITE_API_URL=http://localhost:3000/api
   ```

3. Start the frontend:

   ```bash
   npm run dev
   ```

4. Test the integration by creating, updating, and deleting bookings.

## Production Deployment

1. Deploy backend to AWS (see `example/aws/README.md`)
2. Update frontend `.env` with production API URL
3. Build and deploy frontend:
   ```bash
   npm run build
   # Deploy dist/ folder to S3 + CloudFront, Vercel, Netlify, etc.
   ```
