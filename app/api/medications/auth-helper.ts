import { NextRequest } from 'next/server'
import { verifyToken } from '../../../lib/auth'

export function getUserIdFromRequest(request: NextRequest): string | null {
  try {
    const authHeader = request.headers.get('authorization')
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return null
    }

    const token = authHeader.substring(7) // Remove 'Bearer ' prefix
    const payload = verifyToken(token)
    
    return payload?.userId || null
  } catch (error) {
    console.error('Erro ao extrair userId do token:', error)
    return null
  }
}

export function validateUserAccess(request: NextRequest): { userId: string | null; error?: string } {
  const userId = getUserIdFromRequest(request)
  
  if (!userId) {
    return { 
      userId: null, 
      error: 'Token de autenticação inválido ou não fornecido' 
    }
  }
  
  return { userId }
} 