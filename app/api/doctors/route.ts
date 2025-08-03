import { NextRequest, NextResponse } from 'next/server'
import { PrismaAppointmentService } from '../../services/prisma/appointmentService.prisma'

export async function GET(request: NextRequest) {
  try {
    console.log('👨‍⚕️ Buscando médicos reais do Prisma...');
    
    // Buscar médicos do banco de dados usando Prisma
    const doctors = await PrismaAppointmentService.getDoctors();
    
    // Mapear para o formato esperado pelo frontend
    const formattedDoctors = doctors.map(doctor => ({
      doctorId: doctor.id,
      doctorName: doctor.name,
      specialty: doctor.specialty,
      image: doctor.image || 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=150&h=150&fit=crop&crop=face'
    }));

    console.log('✅ Médicos encontrados:', formattedDoctors.length);
    return NextResponse.json(formattedDoctors);
    
  } catch (error) {
    console.error('❌ Erro ao buscar médicos:', error);
    return NextResponse.json(
      { message: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
} 