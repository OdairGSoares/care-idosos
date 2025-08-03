import { NextRequest, NextResponse } from 'next/server'
import { PrismaAppointmentService } from '../../services/prisma/appointmentService.prisma'

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
    const userId = getUserIdFromRequest(request);
    
    if (!userId) {
      return NextResponse.json(
        { message: 'Token de autorização inválido' },
        { status: 401 }
      );
    }

    console.log('🔍 Buscando consultas no Prisma para userId:', userId);

    // Buscar consultas do usuário usando Prisma
    const appointments = await PrismaAppointmentService.getAppointments(userId);
    
    // Mapear dados para formato esperado pelo frontend
    const formattedAppointments = appointments.map(appointment => ({
      id: appointment.id,
      date: appointment.date,
      time: appointment.time,
      confirmed: appointment.confirmed,
      userId: appointment.userId,
      doctorId: appointment.doctorId,
      locationId: appointment.locationId,
      createdAt: appointment.createdAt.toISOString(),
      doctor: {
        doctorId: appointment.doctor.id,
        doctorName: appointment.doctor.name,
        specialty: appointment.doctor.specialty
      },
      location: {
        locationId: appointment.location.id,
        locationName: appointment.location.name,
        locationAddress: appointment.location.address,
        locationCity: appointment.location.city
      }
    }));
    
    console.log('✅ Consultas encontradas no Prisma:', formattedAppointments.length);

    return NextResponse.json(formattedAppointments);
  } catch (error) {
    console.error('❌ Erro ao buscar consultas no Prisma:', error);
    return NextResponse.json(
      { message: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    console.log('🚀 Iniciando criação de consulta...');
    
    const userId = getUserIdFromRequest(request);
    console.log('🔍 UserId obtido:', userId);
    
    if (!userId) {
      console.log('❌ Falha na autenticação - token inválido');
      return NextResponse.json(
        { message: 'Token de autorização inválido' },
        { status: 401 }
      );
    }

    const body = await request.json();
    console.log('📦 Dados recebidos:', body);
    
    const { doctorId, locationId, date, time } = body;
    
    // Validar dados obrigatórios
    if (!doctorId || !locationId || !date || !time) {
      console.log('❌ Dados obrigatórios faltando:', { doctorId, locationId, date, time });
      return NextResponse.json(
        { message: 'Médico, localização, data e horário são obrigatórios' },
        { status: 400 }
      );
    }

    console.log('📅 Criando nova consulta no Prisma para userId:', userId);
    console.log('📋 Dados da consulta:', { doctorId, locationId, date, time });

    // Verificar disponibilidade do horário
    console.log('⏰ Verificando disponibilidade...');
    const isAvailable = await PrismaAppointmentService.checkTimeSlotAvailability(
      doctorId, locationId, date, time
    );
    console.log('✅ Horário disponível:', isAvailable);

    if (!isAvailable) {
      console.log('❌ Horário já ocupado');
      return NextResponse.json(
        { message: 'Este horário já está ocupado' },
        { status: 409 }
      );
    }

    // Criar nova consulta usando Prisma
    console.log('💾 Criando consulta no banco...');
    const newAppointment = await PrismaAppointmentService.createAppointment({
      date,
      time,
      doctorId,
      locationId,
      userId
    });

    console.log('✅ Consulta criada no Prisma:', newAppointment.id);

    // Mapear para formato esperado pelo frontend
    const formattedAppointment = {
      id: newAppointment.id,
      date: newAppointment.date,
      time: newAppointment.time,
      confirmed: newAppointment.confirmed,
      userId: newAppointment.userId,
      doctorId: newAppointment.doctorId,
      locationId: newAppointment.locationId,
      createdAt: newAppointment.createdAt.toISOString(),
      doctor: {
        doctorId: newAppointment.doctor.id,
        doctorName: newAppointment.doctor.name,
        specialty: newAppointment.doctor.specialty
      },
      location: {
        locationId: newAppointment.location.id,
        locationName: newAppointment.location.name,
        locationAddress: newAppointment.location.address,
        locationCity: newAppointment.location.city
      }
    };

    console.log('🎉 Consulta formatada e pronta para retorno');

    return NextResponse.json(
      { 
        success: true, 
        message: 'Consulta agendada com sucesso',
        data: formattedAppointment
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('❌ ERRO DETALHADO ao criar consulta:', error);
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