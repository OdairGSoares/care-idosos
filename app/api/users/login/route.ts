import { PrismaUserService } from '@/services/prisma/userService.prisma'
import type { IUserDataLogin } from '@/types/api'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const credentials: IUserDataLogin = await request.json()
    const result = await PrismaUserService.login(credentials)
    
    if (result) {
      return NextResponse.json(result, { status: 200 })
    } else {
      return NextResponse.json(
        { message: 'Credenciais inválidas' },
        { status: 401 }
      )
    }
  } catch (error) {
    console.error('Erro no login:', error)
    const message = error instanceof Error ? error.message : 'Erro interno do servidor'
    return NextResponse.json({ message }, { status: 401 })
  }
} 