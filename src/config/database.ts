import * as dotenv from 'dotenv'

// Only load .env file in development
if (process.env.NODE_ENV !== 'production') {
    dotenv.config()
}

export const isDevelopment = process.env.NODE_ENV !== 'production'
export const isProduction = process.env.NODE_ENV === 'production'

// Set default DATABASE_PROVIDER based on environment
if (!process.env.DATABASE_PROVIDER) {
    process.env.DATABASE_PROVIDER = isDevelopment ? 'sqlite' : 'postgresql'
}

export const getDatabaseUrl = () => {
    if (!process.env.DATABASE_URL) {
        throw new Error('DATABASE_URL environment variable is not set')
    }
    return process.env.DATABASE_URL
}
