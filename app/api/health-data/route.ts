import { NextRequest, NextResponse } from 'next/server'
import { PrismaHealthDataService, HealthDataType } from '../../services/prisma/healthDataService.prisma'

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
    console.log('📊 [API] Iniciando busca de dados de saúde...');
    
    const userId = getUserIdFromRequest(request);
    if (!userId) {
      console.log('❌ [API] Falha na autenticação - token inválido');
      return NextResponse.json(
        { message: 'Token de autorização inválido' },
        { status: 401 }
      );
    }

    console.log('✅ [API] Autenticação válida para usuário:', userId);

    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type') as HealthDataType | null;
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');

    console.log('🔍 [API] Parâmetros da busca:', { type, startDate, endDate });

    let healthData;

    try {
      if (startDate && endDate) {
        console.log('📅 [API] Buscando por período específico...');
        // Buscar por período específico
        healthData = await PrismaHealthDataService.getHealthDataByDateRange(
          userId, 
          startDate, 
          endDate, 
          type || undefined
        );
      } else if (type) {
        console.log('🔍 [API] Buscando por tipo específico:', type);
        // Buscar por tipo específico
        healthData = await PrismaHealthDataService.getHealthDataByType(userId, type);
      } else {
        console.log('📋 [API] Buscando todos os dados...');
        // Buscar todos os dados
        healthData = await PrismaHealthDataService.getAllHealthData(userId);
      }
    } catch (serviceError) {
      console.error('❌ [API] Erro no serviço Prisma:', serviceError);
      console.error('❌ [API] Stack trace do serviço:', serviceError instanceof Error ? serviceError.stack : 'N/A');
      
      // Retornar erro específico do serviço
      return NextResponse.json(
        { 
          message: 'Erro ao acessar dados de saúde',
          error: serviceError instanceof Error ? serviceError.message : 'Erro desconhecido no serviço'
        },
        { status: 500 }
      );
    }

    console.log('✅ [API] Dados de saúde encontrados:', healthData?.length || 0);
    return NextResponse.json(healthData || []);
    
  } catch (error) {
    console.error('❌ [API] ERRO GERAL ao buscar dados de saúde:', error);
    console.error('❌ [API] Stack trace geral:', error instanceof Error ? error.stack : 'N/A');
    console.error('❌ [API] Tipo do erro:', typeof error);
    console.error('❌ [API] Mensagem do erro:', error instanceof Error ? error.message : 'N/A');
    
    return NextResponse.json(
      { 
        message: 'Erro interno do servidor',
        error: error instanceof Error ? error.message : 'Erro desconhecido',
        details: 'Erro na API de health-data'
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    console.log('➕ Criando novo dado de saúde...');
    
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
    
    const { type, value, secondaryValue, date, notes } = body;
    
    // Validar dados obrigatórios
    if (!type || value === undefined || !date) {
      console.log('❌ Dados obrigatórios faltando:', { type, value, date });
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

    console.log('💾 Criando dado de saúde no banco para usuário:', userId);
    
    const newHealthData = await PrismaHealthDataService.addHealthData(
      {
        type: type as HealthDataType,
        value: parseFloat(value),
        secondaryValue: secondaryValue ? parseFloat(secondaryValue) : undefined,
        date,
        notes: notes || undefined
      },
      userId
    );

    console.log('✅ Dado de saúde criado com sucesso:', newHealthData.id);

    return NextResponse.json(
      { 
        success: true, 
        message: 'Dado de saúde registrado com sucesso',
        data: newHealthData
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('❌ ERRO DETALHADO ao criar dado de saúde:', error);
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

// Rota para gerar dados de exemplo
export async function PUT(request: NextRequest) {
  try {
    console.log('🌱 Gerando dados de exemplo...');
    
    const userId = getUserIdFromRequest(request);
    if (!userId) {
      console.log('❌ Falha na autenticação - token inválido');
      return NextResponse.json(
        { message: 'Token de autorização inválido' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { action } = body;

    if (action === 'generateSample') {
      await PrismaHealthDataService.generateSampleData(userId);
      
      console.log('✅ Dados de exemplo gerados com sucesso');
      return NextResponse.json({
        success: true,
        message: 'Dados de exemplo gerados com sucesso'
      });
    }

    return NextResponse.json(
      { message: 'Ação inválida' },
      { status: 400 }
    );
  } catch (error) {
    console.error('❌ ERRO DETALHADO ao gerar dados de exemplo:', error);
    return NextResponse.json(
      { 
        message: 'Erro interno do servidor',
        error: error instanceof Error ? error.message : 'Erro desconhecido'
      },
      { status: 500 }
    );
  }
} 