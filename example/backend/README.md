# Booker Backend API

RESTful API for the Booking App built with Express.js and MongoDB.

## Features

- RESTful API endpoints for booking management
- MongoDB integration with Mongoose
- Input validation with express-validator
- Error handling middleware
- CORS support
- Security headers with Helmet
- Request logging with Morgan
- Response compression

## Installation

```bash
npm install
```

## Configuration

1. Copy `env.example` to `.env`
2. Update the environment variables in `.env`

## Running the Server

### Development

```bash
npm run dev
```

### Production

```bash
npm start
```

## API Endpoints

### Health Check

- `GET /health` - Check server status

### Bookings

- `GET /api/bookings` - Get all bookings
- `GET /api/bookings/:id` - Get booking by ID
- `GET /api/bookings/date/:date` - Get bookings by date
- `POST /api/bookings/availability` - Check time slot availability
- `POST /api/bookings` - Create new booking
- `PUT /api/bookings/:id` - Update booking
- `DELETE /api/bookings/:id` - Delete booking

## Database

The application uses MongoDB. You can use:

- Local MongoDB instance
- MongoDB Atlas (cloud)
- AWS DocumentDB

## Environment Variables

- `PORT` - Server port (default: 3000)
- `MONGODB_URI` - MongoDB connection string
- `FRONTEND_URL` - Frontend URL for CORS
- `NODE_ENV` - Environment (development/production)

## Testing

```bash
npm test
```
