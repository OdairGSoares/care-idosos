import { NextRequest, NextResponse } from 'next/server'
import { PrismaEmergencyContactService } from '../../../services/prisma/emergencyContactService.prisma'

type RouteParams = {
  params: Promise<{ id: string }>
}

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

export async function PUT(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    console.log('✏️ Atualizando contato de emergência...');
    
    const userId = getUserIdFromRequest(request);
    if (!userId) {
      console.log('❌ Falha na autenticação - token inválido');
      return NextResponse.json(
        { message: 'Token de autorização inválido' },
        { status: 401 }
      );
    }

    const { id } = await params;
    const body = await request.json();
    console.log('📋 Dados para atualização:', { id, body });
    
    const { name, phone, relationship, isMainContact } = body;
    
    // Validar dados obrigatórios
    if (!name || !phone || !relationship) {
      console.log('❌ Dados obrigatórios faltando para atualização');
      return NextResponse.json(
        { message: 'Nome, telefone e relacionamento são obrigatórios' },
        { status: 400 }
      );
    }

    console.log('💾 Atualizando contato no banco...');
    
    const result = await PrismaEmergencyContactService.updateEmergencyContact(
      id,
      {
        name,
        phone,
        relationship,
        isMainContact: isMainContact || false
      },
      userId
    );

    if (!result) {
      console.log('❌ Contato não encontrado ou erro na atualização');
      return NextResponse.json(
        { message: 'Contato não encontrado ou erro na atualização' },
        { status: 404 }
      );
    }

    console.log('✅ Contato atualizado com sucesso:', id);

    // Buscar o contato atualizado para retornar os dados completos
    const updatedContact = await PrismaEmergencyContactService.getEmergencyContactById(id, userId);

    return NextResponse.json({
      success: true,
      message: result,
      data: updatedContact
    });
  } catch (error) {
    console.error('❌ ERRO DETALHADO ao atualizar contato:', error);
    console.error('❌ Stack trace:', error instanceof Error ? error.stack : 'N/A');
    return NextResponse.json(
      { 
        message: 'Erro interno do servidor',
        error: error instanceof Error ? error.message : 'Erro desconhecido'
      },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    console.log('🗑️ Removendo contato de emergência...');
    
    const userId = getUserIdFromRequest(request);
    if (!userId) {
      console.log('❌ Falha na autenticação - token inválido');
      return NextResponse.json(
        { message: 'Token de autorização inválido' },
        { status: 401 }
      );
    }

    const { id } = await params;
    console.log('🔍 Removendo contato ID:', id, 'para usuário:', userId);
    
    const result = await PrismaEmergencyContactService.removeEmergencyContact(id, userId);

    if (!result) {
      console.log('❌ Contato não encontrado ou erro na remoção');
      return NextResponse.json(
        { message: 'Contato não encontrado' },
        { status: 404 }
      );
    }

    console.log('✅ Contato removido com sucesso:', id);

    return NextResponse.json({
      success: true,
      message: result
    });
  } catch (error) {
    console.error('❌ ERRO DETALHADO ao remover contato:', error);
    console.error('❌ Stack trace:', error instanceof Error ? error.stack : 'N/A');
    return NextResponse.json(
      { 
        message: 'Erro interno do servidor',
        error: error instanceof Error ? error.message : 'Erro desconhecido'
      },
      { status: 500 }
    );
  }
} 