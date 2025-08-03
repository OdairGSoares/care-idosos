import { PrismaUserService } from '@/services/prisma/userService.prisma'
import { NextRequest, NextResponse } from 'next/server'

type RouteParams = {
  params: Promise<{ id: string }>
}

export async function GET(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const { id } = await params
    const user = await PrismaUserService.getUserById(id)
    
    if (user) {
      return NextResponse.json(user)
    } else {
      return NextResponse.json(
        { message: 'Usuário não encontrado' },
        { status: 404 }
      )
    }
  } catch (error) {
    console.error('Erro ao buscar usuário:', error)
    return NextResponse.json(
      { message: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
} 