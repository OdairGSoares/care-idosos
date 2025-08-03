import { NextRequest, NextResponse } from 'next/server'
import { PrismaHealthDataService, HealthDataType } from '../../../services/prisma/healthDataService.prisma'

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

export async function GET(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    console.log('🔍 Buscando dado de saúde específico...');
    
    const userId = getUserIdFromRequest(request);
    if (!userId) {
      console.log('❌ Falha na autenticação - token inválido');
      return NextResponse.json(
        { message: 'Token de autorização inválido' },
        { status: 401 }
      );
    }

    const { id } = await params;
    console.log('🔍 Buscando dado ID:', id, 'para usuário:', userId);
    
    const healthData = await PrismaHealthDataService.getHealthDataById(id, userId);

    if (!healthData) {
      console.log('❌ Dado de saúde não encontrado');
      return NextResponse.json(
        { message: 'Dado de saúde não encontrado' },
        { status: 404 }
      );
    }

    console.log('✅ Dado de saúde encontrado:', healthData.id);
    return NextResponse.json(healthData);
    
  } catch (error) {
    console.error('❌ ERRO DETALHADO ao buscar dado:', error);
    return NextResponse.json(
      { 
        message: 'Erro interno do servidor',
        error: error instanceof Error ? error.message : 'Erro desconhecido'
      },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    console.log('✏️ Atualizando dado de saúde...');
    
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
    
    const { type, value, secondaryValue, date, notes } = body;
    
    // Validar dados obrigatórios
    if (!type || value === undefined || !date) {
      console.log('❌ Dados obrigatórios faltando para atualização');
      return NextResponse.json(
        { message: 'Tipo, valor e data são obrigatórios' },
        { status: 400 }
      );
    }

    // Validar tipo
    const validTypes: HealthDataType[] = ['bloodPressure', 'heartRate', 'glucose', 'weight', 'temperature'];
    if (!validTypes.includes(type)) {
      console.log('❌ Tipo inválido:', type);
      return NextResponse.json(
        { message: 'Tipo de dado inválido' },
        { status: 400 }
      );
    }

    console.log('💾 Atualizando dado no banco...');
    
    const updatedHealthData = await PrismaHealthDataService.updateHealthData(
      id,
      {
        type: type as HealthDataType,
        value: parseFloat(value),
        secondaryValue: secondaryValue ? parseFloat(secondaryValue) : undefined,
        date,
        notes: notes || undefined
      },
      userId
    );

    if (!updatedHealthData) {
      console.log('❌ Dado não encontrado ou não pertence ao usuário');
      return NextResponse.json(
        { message: 'Dado não encontrado' },
        { status: 404 }
      );
    }

    console.log('✅ Dado atualizado com sucesso:', id);

    return NextResponse.json({
      success: true,
      message: 'Dado de saúde atualizado com sucesso',
      data: updatedHealthData
    });
  } catch (error) {
    console.error('❌ ERRO DETALHADO ao atualizar dado:', error);
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
    console.log('🗑️ Removendo dado de saúde...');
    
    const userId = getUserIdFromRequest(request);
    if (!userId) {
      console.log('❌ Falha na autenticação - token inválido');
      return NextResponse.json(
        { message: 'Token de autorização inválido' },
        { status: 401 }
      );
    }

    const { id } = await params;
    console.log('🔍 Removendo dado ID:', id, 'para usuário:', userId);
    
    const success = await PrismaHealthDataService.deleteHealthData(id, userId);

    if (!success) {
      console.log('❌ Dado não encontrado ou não pertence ao usuário');
      return NextResponse.json(
        { message: 'Dado não encontrado' },
        { status: 404 }
      );
    }

    console.log('✅ Dado removido com sucesso:', id);

    return NextResponse.json({
      success: true,
      message: 'Dado de saúde removido com sucesso'
    });
  } catch (error) {
    console.error('❌ ERRO DETALHADO ao remover dado:', error);
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