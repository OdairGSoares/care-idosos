import { NextRequest, NextResponse } from 'next/server'
import { PrismaAppointmentService } from '../../../services/prisma/appointmentService.prisma'

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
    console.log('🔄 Iniciando reagendamento de consulta...');
    
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
    console.log('📋 Dados para reagendamento:', { id, body });
    
    const { date, time, doctorId, locationId } = body;
    
    // Validar dados obrigatórios
    if (!date || !time) {
      console.log('❌ Dados obrigatórios faltando para reagendamento');
      return NextResponse.json(
        { message: 'Data e horário são obrigatórios' },
        { status: 400 }
      );
    }

    // Verificar disponibilidade do horário se mudou médico/localização
    if (doctorId && locationId) {
      console.log('⏰ Verificando disponibilidade do novo horário...');
      const isAvailable = await PrismaAppointmentService.checkTimeSlotAvailability(
        doctorId, locationId, date, time
      );
      
      if (!isAvailable) {
        console.log('❌ Novo horário já ocupado');
        return NextResponse.json(
          { message: 'Este horário já está ocupado' },
          { status: 409 }
        );
      }
    }

    // Atualizar consulta usando Prisma
    console.log('💾 Atualizando consulta no banco...');
    const updatedAppointment = await PrismaAppointmentService.updateAppointment(
      id,
      { date, time, doctorId, locationId },
      userId
    );

    if (!updatedAppointment) {
      console.log('❌ Consulta não encontrada ou não pertence ao usuário');
      return NextResponse.json(
        { message: 'Consulta não encontrada' },
        { status: 404 }
      );
    }

    console.log('✅ Consulta reagendada com sucesso:', id);

    // Mapear para formato esperado pelo frontend
    const formattedAppointment = {
      id: updatedAppointment.id,
      date: updatedAppointment.date,
      time: updatedAppointment.time,
      confirmed: updatedAppointment.confirmed,
      userId: updatedAppointment.userId,
      doctorId: updatedAppointment.doctorId,
      locationId: updatedAppointment.locationId,
      createdAt: updatedAppointment.createdAt.toISOString(),
      doctor: {
        doctorId: updatedAppointment.doctor.id,
        doctorName: updatedAppointment.doctor.name,
        specialty: updatedAppointment.doctor.specialty
      },
      location: {
        locationId: updatedAppointment.location.id,
        locationName: updatedAppointment.location.name,
        locationAddress: updatedAppointment.location.address,
        locationCity: updatedAppointment.location.city
      }
    };

    return NextResponse.json({
      success: true,
      message: 'Consulta reagendada com sucesso',
      data: formattedAppointment
    });
  } catch (error) {
    console.error('❌ ERRO DETALHADO ao reagendar consulta:', error);
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
    console.log('🗑️ Iniciando cancelamento de consulta...');
    
    const userId = getUserIdFromRequest(request);
    if (!userId) {
      console.log('❌ Falha na autenticação - token inválido');
      return NextResponse.json(
        { message: 'Token de autorização inválido' },
        { status: 401 }
      );
    }

    const { id } = await params;
    console.log('🔍 Cancelando consulta ID:', id, 'para usuário:', userId);
    
    // Deletar consulta usando Prisma
    console.log('💾 Removendo consulta do banco...');
    const result = await PrismaAppointmentService.deleteAppointment(id, userId);

    if (!result) {
      console.log('❌ Consulta não encontrada ou não pertence ao usuário');
      return NextResponse.json(
        { message: 'Consulta não encontrada' },
        { status: 404 }
      );
    }

    console.log('✅ Consulta cancelada com sucesso:', id);

    return NextResponse.json({
      success: true,
      message: 'Consulta cancelada com sucesso'
    });
  } catch (error) {
    console.error('❌ ERRO DETALHADO ao cancelar consulta:', error);
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