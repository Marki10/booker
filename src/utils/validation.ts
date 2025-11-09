export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

export const validateName = (name: string): boolean => {
  return name.trim().length >= 2
}

export const validateTime = (time: string): boolean => {
  const timeRegex = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/
  return timeRegex.test(time)
}

export const validateDate = (date: string): boolean => {
  const dateRegex = /^\d{4}-\d{2}-\d{2}$/
  if (!dateRegex.test(date)) return false

  const d = new Date(date)
  return d instanceof Date && !isNaN(d.getTime())
}

export interface ValidationError {
  field: string
  message: string
}

export const validateBookingForm = (
  name: string,
  email: string,
  date: string,
  time: string,
  duration: number
): ValidationError[] => {
  const errors: ValidationError[] = []

  if (!validateName(name)) {
    errors.push({ field: 'name', message: 'Name must be at least 2 characters long' })
  }

  if (!validateEmail(email)) {
    errors.push({ field: 'email', message: 'Please enter a valid email address' })
  }

  if (!validateDate(date)) {
    errors.push({ field: 'date', message: 'Please enter a valid date' })
  }

  if (!validateTime(time)) {
    errors.push({ field: 'time', message: 'Please enter a valid time' })
  }

  if (duration < 15 || duration > 480) {
    errors.push({ field: 'duration', message: 'Duration must be between 15 and 480 minutes' })
  }

  return errors
}

