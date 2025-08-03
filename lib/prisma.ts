import { PrismaClient } from '@prisma/client'

declare global {
  var prisma: PrismaClient | undefined
}

export const prisma = globalThis.prisma ?? 
  new PrismaClient({
    log: ['query'],
  })

// Usar process.env.NODE_ENV para compatibilidade com Node.js e browser
if (process.env.NODE_ENV === 'development') globalThis.prisma = prisma 