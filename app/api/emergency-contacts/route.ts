import { NextRequest, NextResponse } from 'next/server'
import { PrismaEmergencyContactService } from '../../services/prisma/emergencyContactService.prisma'

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

export async function GET(request: NextRequest) {
  try {
    console.log('📋 Buscando contatos de emergência...');
    
    const userId = getUserIdFromRequest(request);
    if (!userId) {
      console.log('❌ Falha na autenticação - token inválido');
      return NextResponse.json(
        { message: 'Token de autorização inválido' },
        { status: 401 }
      );
    }

    console.log('🔍 Buscando contatos para usuário:', userId);
    
    const contacts = await PrismaEmergencyContactService.getEmergencyContacts(userId);
    
    if (contacts === null) {
      console.log('❌ Erro ao buscar contatos');
      return NextResponse.json(
        { message: 'Erro ao buscar contatos de emergência' },
        { status: 500 }
      );
    }

    console.log('✅ Contatos encontrados:', contacts.length);
    return NextResponse.json(contacts);
    
  } catch (error) {
    console.error('❌ ERRO DETALHADO ao buscar contatos:', error);
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

export async function POST(request: NextRequest) {
  try {
    console.log('➕ Criando novo contato de emergência...');
    
    const userId = getUserIdFromRequest(request);
    if (!userId) {
      console.log('❌ Falha na autenticação - token inválido');
      return NextResponse.json(
        { message: 'Token de autorização inválido' },
        { status: 401 }
      );
    }

    const body = await request.json();
    console.log('📦 Dados recebidos:', body);
    
    const { name, phone, relationship, isMainContact } = body;
    
    // Validar dados obrigatórios
    if (!name || !phone || !relationship) {
      console.log('❌ Dados obrigatórios faltando:', { name, phone, relationship });
      return NextResponse.json(
        { message: 'Nome, telefone e relacionamento são obrigatórios' },
        { status: 400 }
      );
    }

    console.log('💾 Criando contato no banco para usuário:', userId);
    
    const result = await PrismaEmergencyContactService.addEmergencyContact(
      {
        name,
        phone,
        relationship,
        isMainContact: isMainContact || false
      },
      userId
    );

    if (!result) {
      console.log('❌ Erro ao criar contato');
      return NextResponse.json(
        { message: 'Erro ao criar contato de emergência' },
        { status: 500 }
      );
    }

    console.log('✅ Contato criado com sucesso');

    // Buscar o contato criado para retornar os dados completos
    const contacts = await PrismaEmergencyContactService.getEmergencyContacts(userId);
    const newContact = contacts?.find(c => c.name === name && c.phone === phone);

    return NextResponse.json(
      { 
        success: true, 
        message: result,
        data: newContact
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('❌ ERRO DETALHADO ao criar contato:', error);
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