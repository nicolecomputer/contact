import { PrismaClient } from '@prisma/client'
import { isDevelopment } from '../config/database'

const prisma = new PrismaClient({
    log: isDevelopment ? ['query', 'error', 'warn'] : ['error'],
})

export default prisma
