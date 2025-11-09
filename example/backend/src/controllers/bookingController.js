import Booking from '../models/Booking.js'

// Get all bookings
export const getBookings = async (req, res, next) => {
  try {
    const bookings = await Booking.find().sort({ date: 1, time: 1 })
    res.json(bookings)
  } catch (error) {
    next(error)
  }
}

// Get booking by ID
export const getBookingById = async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id)
    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' })
    }
    res.json(booking)
  } catch (error) {
    next(error)
  }
}

// Get bookings by date
export const getBookingsByDate = async (req, res, next) => {
  try {
    const bookings = await Booking.find({ date: req.params.date }).sort({ time: 1 })
    res.json(bookings)
  } catch (error) {
    next(error)
  }
}

// Check availability
export const checkAvailability = async (req, res, next) => {
  try {
    const { date, time, duration, excludeBookingId } = req.body

    const requestedStart = new Date(`${date}T${time}`)
    const requestedEnd = new Date(requestedStart.getTime() + duration * 60000)

    const query = {
      date,
      $or: [
        {
          $expr: {
            $and: [
              { $gte: [{ $dateFromString: { dateString: { $concat: ['$date', 'T', '$time'] } } }, requestedStart] },
              { $lt: [{ $dateFromString: { dateString: { $concat: ['$date', 'T', '$time'] } } }, requestedEnd] }
            ]
          }
        },
        {
          $expr: {
            $and: [
              { $gt: [{ $dateFromParts: { 
                year: { $year: { $dateFromString: { dateString: { $concat: ['$date', 'T', '$time'] } } } },
                month: { $month: { $dateFromString: { dateString: { $concat: ['$date', 'T', '$time'] } } } },
                day: { $dayOfMonth: { $dateFromString: { dateString: { $concat: ['$date', 'T', '$time'] } } } },
                hour: { $hour: { $dateFromString: { dateString: { $concat: ['$date', 'T', '$time'] } } } },
                minute: { $minute: { $dateFromString: { dateString: { $concat: ['$date', 'T', '$time'] } } } }
              }}, requestedStart] },
              { $lte: [{ $dateFromParts: { 
                year: { $year: { $dateFromString: { dateString: { $concat: ['$date', 'T', { $concat: ['$date', 'T', '$time'] }] } } } },
                month: { $month: { $dateFromString: { dateString: { $concat: ['$date', 'T', '$time'] } } } },
                day: { $dayOfMonth: { $dateFromString: { dateString: { $concat: ['$date', 'T', '$time'] } } } },
                hour: { $hour: { $dateFromString: { dateString: { $concat: ['$date', 'T', '$time'] } } } },
                minute: { $minute: { $dateFromString: { dateString: { $concat: ['$date', 'T', '$time'] } } } }
              }}, requestedEnd] }
            ]
          }
        }
      ]
    }

    // Simpler approach using JavaScript
    const conflictingBookings = await Booking.find({ date })
    
    const isAvailable = !conflictingBookings.some(booking => {
      if (excludeBookingId && booking._id.toString() === excludeBookingId) {
        return false
      }

      const bookingStart = new Date(`${booking.date}T${booking.time}`)
      const bookingEnd = new Date(bookingStart.getTime() + booking.duration * 60000)

      return (
        (requestedStart >= bookingStart && requestedStart < bookingEnd) ||
        (requestedEnd > bookingStart && requestedEnd <= bookingEnd) ||
        (requestedStart <= bookingStart && requestedEnd >= bookingEnd)
      )
    })

    res.json({ available: isAvailable })
  } catch (error) {
    next(error)
  }
}

// Create new booking
export const createBooking = async (req, res, next) => {
  try {
    // Check availability first
    const { date, time, duration } = req.body
    const requestedStart = new Date(`${date}T${time}`)
    const requestedEnd = new Date(requestedStart.getTime() + duration * 60000)

    const existingBookings = await Booking.find({ date })
    const hasConflict = existingBookings.some(booking => {
      const bookingStart = new Date(`${booking.date}T${booking.time}`)
      const bookingEnd = new Date(bookingStart.getTime() + booking.duration * 60000)

      return (
        (requestedStart >= bookingStart && requestedStart < bookingEnd) ||
        (requestedEnd > bookingStart && requestedEnd <= bookingEnd) ||
        (requestedStart <= bookingStart && requestedEnd >= bookingEnd)
      )
    })

    if (hasConflict) {
      return res.status(409).json({ error: 'Time slot is already booked' })
    }

    const booking = await Booking.create(req.body)
    res.status(201).json(booking)
  } catch (error) {
    next(error)
  }
}

// Update booking
export const updateBooking = async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id)
    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' })
    }

    // Check availability if time/date changed
    if (req.body.date || req.body.time || req.body.duration) {
      const date = req.body.date || booking.date
      const time = req.body.time || booking.time
      const duration = req.body.duration || booking.duration

      const requestedStart = new Date(`${date}T${time}`)
      const requestedEnd = new Date(requestedStart.getTime() + duration * 60000)

      const existingBookings = await Booking.find({ date })
      const hasConflict = existingBookings.some(b => {
        if (b._id.toString() === req.params.id) return false

        const bookingStart = new Date(`${b.date}T${b.time}`)
        const bookingEnd = new Date(bookingStart.getTime() + b.duration * 60000)

        return (
          (requestedStart >= bookingStart && requestedStart < bookingEnd) ||
          (requestedEnd > bookingStart && requestedEnd <= bookingEnd) ||
          (requestedStart <= bookingStart && requestedEnd >= bookingEnd)
        )
      })

      if (hasConflict) {
        return res.status(409).json({ error: 'Time slot is already booked' })
      }
    }

    const updatedBooking = await Booking.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    )

    res.json(updatedBooking)
  } catch (error) {
    next(error)
  }
}

// Delete booking
export const deleteBooking = async (req, res, next) => {
  try {
    const booking = await Booking.findByIdAndDelete(req.params.id)
    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' })
    }
    res.json({ message: 'Booking deleted successfully' })
  } catch (error) {
    next(error)
  }
}

