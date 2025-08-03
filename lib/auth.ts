import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import { prisma } from './prisma'

const JWT_SECRET = process.env.VITE_JWT_SECRET || 'fallback-secret-key'

export interface JWTPayload {
  userId: string
  email: string
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12)
}

export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword)
}

export function generateToken(payload: JWTPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' })
}

export function verifyToken(token: string): JWTPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as JWTPayload
  } catch {
    return null
  }
}

export async function getCurrentUser(token: string) {
  const payload = verifyToken(token)
  if (!payload) return null
  
  return prisma.user.findUnique({
    where: { id: payload.userId },
    select: {
      id: true,
      userFirstName: true,
      userLastName: true,
      email: true,
      phone: true,
      createdAt: true,
      updatedAt: true,
    }
  })
} 