import mongoose from 'mongoose'

export const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/booker', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    console.log(`MongoDB Connected: ${conn.connection.host}`)
  } catch (error) {
    console.error('Database connection error:', error)
    throw error
  }
}

// For AWS DocumentDB or MongoDB Atlas, use connection string like:
// mongodb://username:password@cluster-endpoint:27017/booker?tls=true&replicaSet=rs0&readPreference=secondaryPreferred&retryWrites=false

