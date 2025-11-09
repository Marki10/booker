# Booker Backend and AWS Deployment Examples

This directory contains example backend implementations and AWS deployment configurations for the Booker application.

## Directory Structure

```
example/
├── backend/           # Node.js/Express backend API
│   ├── src/
│   │   ├── config/    # Database configuration
│   │   ├── controllers/ # Request handlers
│   │   ├── models/    # MongoDB models
│   │   ├── routes/    # API routes
│   │   └── middleware/ # Middleware functions
│   ├── package.json
│   └── README.md
└── aws/               # AWS deployment configurations
    ├── docker/        # Docker configurations
    ├── ecs/           # ECS task definitions
    ├── cloudformation/ # CloudFormation templates
    ├── sam/           # AWS SAM templates
    ├── scripts/       # Deployment scripts
    └── README.md
```

## Backend API

The backend is built with:
- **Express.js** - Web framework
- **MongoDB** - Database (with Mongoose ODM)
- **express-validator** - Input validation
- **Helmet** - Security headers
- **CORS** - Cross-origin resource sharing

### Features

- RESTful API endpoints
- Input validation
- Error handling
- Database models
- Security middleware
- Health checks
- Availability checking

### API Endpoints

- `GET /health` - Health check
- `GET /api/bookings` - Get all bookings
- `GET /api/bookings/:id` - Get booking by ID
- `GET /api/bookings/date/:date` - Get bookings by date
- `POST /api/bookings/availability` - Check time slot availability
- `POST /api/bookings` - Create new booking
- `PUT /api/bookings/:id` - Update booking
- `DELETE /api/bookings/:id` - Delete booking

## AWS Deployment

Multiple deployment options are provided:

1. **ECS Fargate** - Container-based deployment (recommended for production)
2. **AWS SAM** - Serverless deployment with Lambda
3. **Docker Compose** - Local development

### Quick Start

1. **Set up backend locally**
   ```bash
   cd backend
   npm install
   cp .env.example .env
   # Edit .env with your configuration
   npm run dev
   ```

2. **Deploy to AWS ECS**
   ```bash
   cd aws/scripts
   chmod +x deploy.sh setup-secrets.sh
   ./setup-secrets.sh us-east-1 "mongodb://..." "https://your-frontend.com"
   ./deploy.sh production us-east-1
   ```

3. **Deploy with AWS SAM**
   ```bash
   cd aws/sam
   sam build
   sam deploy --guided
   ```

## Database Setup

### Option 1: MongoDB Atlas (Recommended for development)
1. Create account at https://www.mongodb.com/cloud/atlas
2. Create a cluster
3. Get connection string
4. Update `.env` file

### Option 2: AWS DocumentDB (Recommended for production)
1. Create DocumentDB cluster in AWS
2. Configure security groups
3. Get connection endpoint
4. Update secrets in AWS Secrets Manager

### Option 3: Local MongoDB
```bash
docker run -d -p 27017:27017 --name mongodb mongo:7
```

## Environment Variables

See `backend/.env.example` for all required environment variables.

## Integration with Frontend

Update the frontend `bookingService.ts` to use the API:

```typescript
const API_URL = process.env.VITE_API_URL || 'http://localhost:3000/api'

export const bookingService = {
  getAllBookings: async (): Promise<Booking[]> => {
    const response = await fetch(`${API_URL}/bookings`)
    return response.json()
  },
  // ... other methods
}
```

## Security Considerations

1. **Authentication** - Add JWT authentication for production
2. **Rate Limiting** - Implement rate limiting
3. **HTTPS** - Use HTTPS in production
4. **CORS** - Configure CORS properly
5. **Secrets** - Use AWS Secrets Manager
6. **Input Validation** - All inputs are validated
7. **SQL Injection** - Not applicable (MongoDB)
8. **XSS** - Sanitize user inputs

## Monitoring

- CloudWatch Logs for application logs
- CloudWatch Metrics for performance metrics
- Health check endpoint for monitoring
- Error tracking (consider Sentry)

## Testing

```bash
cd backend
npm test
```

## Contributing

1. Follow the existing code style
2. Add tests for new features
3. Update documentation
4. Test locally before deploying

## License

Same as main project

