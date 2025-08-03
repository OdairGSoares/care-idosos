import { PrismaUserService } from '@/services/prisma/userService.prisma'
import type { IUserDataWithoutUserId } from '@/types/api'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const userData: IUserDataWithoutUserId = await request.json()
    const result = await PrismaUserService.signUp(userData)
    
    if (result) {
      return NextResponse.json(result, { status: 201 })
    } else {
      return NextResponse.json(
        { message: 'Erro ao criar usuário' },
        { status: 400 }
      )
    }
  } catch (error) {
    console.error('Erro no signup:', error)
    const message = error instanceof Error ? error.message : 'Erro interno do servidor'
    return NextResponse.json({ message }, { status: 400 })
  }
} 