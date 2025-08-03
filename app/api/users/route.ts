import { PrismaUserService } from '@/services/prisma/userService.prisma'
import { NextRequest, NextResponse } from 'next/server'

export async function GET() {
  try {
    const users = await PrismaUserService.getUsers()
    return NextResponse.json(users || [])
  } catch (error) {
    console.error('Erro ao buscar usuários:', error)
    return NextResponse.json(
      { message: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
} 