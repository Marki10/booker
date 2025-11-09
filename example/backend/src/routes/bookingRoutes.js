import express from 'express'
import {
  getBookings,
  getBookingById,
  createBooking,
  updateBooking,
  deleteBooking,
  getBookingsByDate,
  checkAvailability
} from '../controllers/bookingController.js'
import { validateBooking, validateBookingUpdate } from '../middleware/validation.js'

const router = express.Router()

// Get all bookings
router.get('/', getBookings)

// Get booking by ID
router.get('/:id', getBookingById)

// Get bookings by date
router.get('/date/:date', getBookingsByDate)

// Check availability
router.post('/availability', checkAvailability)

// Create new booking
router.post('/', validateBooking, createBooking)

// Update booking
router.put('/:id', validateBookingUpdate, updateBooking)

// Delete booking
router.delete('/:id', deleteBooking)

export default router

