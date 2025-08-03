import { NextRequest, NextResponse } from 'next/server'
import { PrismaAppointmentService } from '../../../../services/prisma/appointmentService.prisma'

function getUserIdFromRequest(request: NextRequest): string | null {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return null;
    }

    const token = authHeader.substring(7);
    // Decodificar o token JWT para extrair o userId
    const base64Payload = token.split('.')[1];
    const payload = JSON.parse(atob(base64Payload));
    return payload?.userId || null;
  } catch (error) {
    console.error('Erro ao extrair userId do token:', error);
    return null;
  }
}

type RouteParams = {
  params: Promise<{ id: string }>
}

export async function PUT(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const userId = getUserIdFromRequest(request);
    
    if (!userId) {
      return NextResponse.json(
        { message: 'Token de autorização inválido' },
        { status: 401 }
      );
    }

    const { id } = await params;
    const { confirmed } = await request.json();
    
    console.log('✅ Confirmando consulta no Prisma ID:', id, 'para userId:', userId);

    // Confirmar a consulta usando Prisma
    const updatedAppointment = await PrismaAppointmentService.updateAppointment(
      id,
      { confirmed },
      userId
    );

    if (!updatedAppointment) {
      return NextResponse.json(
        { message: 'Consulta não encontrada ou você não tem acesso a ela' },
        { status: 404 }
      );
    }

    console.log('✅ Consulta confirmada no Prisma:', id);

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
      message: 'Presença confirmada com sucesso',
      data: formattedAppointment
    });
  } catch (error) {
    console.error('❌ Erro ao confirmar consulta no Prisma:', error);
    return NextResponse.json(
      { message: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
} 