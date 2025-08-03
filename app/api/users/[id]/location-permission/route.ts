import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '../../../../../lib/prisma';

function getUserIdFromRequest(request: NextRequest): string | null {
  try {
    const authHeader = request.headers.get('authorization');
    console.log('🔐 Authorization header:', authHeader ? 'Presente' : 'Ausente');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      console.log('❌ Header de autorização inválido');
      return null;
    }

    const token = authHeader.substring(7);
    console.log('🎫 Token extraído (primeiros 20 chars):', token.substring(0, 20) + '...');
    
    // Decodificar o token JWT para extrair o userId
    const base64Payload = token.split('.')[1];
    const payload = JSON.parse(atob(base64Payload));
    console.log('👤 UserId extraído:', payload?.userId);
    
    return payload?.userId || null;
  } catch (error) {
    console.error('❌ Erro ao extrair userId do token:', error);
    return null;
  }
}

// Função para obter a permissão de localização do usuário
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    console.log('📍 [API] Verificando permissão de localização...');
    
    const userId = getUserIdFromRequest(request);
    if (!userId) {
      console.log('❌ [API] Falha na autenticação - token inválido');
      return NextResponse.json(
        { success: false, message: 'Token de autenticação inválido' },
        { status: 401 }
      );
    }

    // Verificar se o usuário está tentando acessar seus próprios dados
    if (userId !== params.id) {
      console.log('❌ [API] Usuário tentando acessar dados de outro usuário');
      return NextResponse.json(
        { success: false, message: 'Acesso negado' },
        { status: 403 }
      );
    }

    console.log('✅ [API] Autenticação válida para usuário:', userId);

    // Usar raw SQL para contornar problemas do Prisma client
    const result = await prisma.$queryRaw`
      SELECT "locationPermission" 
      FROM users 
      WHERE id = ${userId}
    `;

    if (!result || (result as any[]).length === 0) {
      console.log('❌ [API] Usuário não encontrado');
      return NextResponse.json(
        { success: false, message: 'Usuário não encontrado' },
        { status: 404 }
      );
    }

    const user = (result as any[])[0];
    console.log('✅ [API] Permissão de localização obtida:', user.locationPermission);

    return NextResponse.json({
      success: true,
      locationPermission: user.locationPermission
    });

  } catch (error) {
    console.error('❌ [API] Erro ao obter permissão de localização:', error);
    return NextResponse.json(
      { success: false, message: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}

// Função para atualizar a permissão de localização do usuário
export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    console.log('📍 [API] Atualizando permissão de localização...');
    
    const userId = getUserIdFromRequest(request);
    if (!userId) {
      console.log('❌ [API] Falha na autenticação - token inválido');
      return NextResponse.json(
        { success: false, message: 'Token de autenticação inválido' },
        { status: 401 }
      );
    }

    // Verificar se o usuário está tentando acessar seus próprios dados
    if (userId !== params.id) {
      console.log('❌ [API] Usuário tentando acessar dados de outro usuário');
      return NextResponse.json(
        { success: false, message: 'Acesso negado' },
        { status: 403 }
      );
    }

    console.log('✅ [API] Autenticação válida para usuário:', userId);

    const body = await request.json();
    const { locationPermission } = body;

    if (typeof locationPermission !== 'boolean') {
      console.log('❌ [API] Dados inválidos - locationPermission deve ser boolean');
      return NextResponse.json(
        { success: false, message: 'Dados inválidos' },
        { status: 400 }
      );
    }

    // Usar raw SQL para contornar problemas do Prisma client
    await prisma.$executeRaw`
      UPDATE users 
      SET "locationPermission" = ${locationPermission}, "updatedAt" = NOW()
      WHERE id = ${userId}
    `;

    // Buscar dados atualizados
    const result = await prisma.$queryRaw`
      SELECT id, "userFirstName", "userLastName", email, "locationPermission"
      FROM users 
      WHERE id = ${userId}
    `;

    if (!result || (result as any[]).length === 0) {
      console.log('❌ [API] Usuário não encontrado após atualização');
      return NextResponse.json(
        { success: false, message: 'Usuário não encontrado' },
        { status: 404 }
      );
    }

    const updatedUser = (result as any[])[0];
    console.log('✅ [API] Permissão de localização atualizada:', updatedUser.locationPermission);

    return NextResponse.json({
      success: true,
      message: `Localização ${locationPermission ? 'ativada' : 'desativada'} com sucesso`,
      user: updatedUser
    });

  } catch (error) {
    console.error('❌ [API] Erro ao atualizar permissão de localização:', error);
    return NextResponse.json(
      { success: false, message: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
} 