import { NextRequest, NextResponse } from 'next/server'
import { PrismaAppointmentService } from '../../services/prisma/appointmentService.prisma'

export async function GET(request: NextRequest) {
  try {
    console.log('🏥 Buscando localizações reais do Prisma...');
    
    // Buscar localizações do banco de dados usando Prisma
    const locations = await PrismaAppointmentService.getLocations();
    
    // Mapear para o formato esperado pelo frontend
    const formattedLocations = locations.map(location => ({
      locationId: location.id,
      locationName: location.name,
      locationAddress: location.address,
      locationCity: location.city
    }));

    console.log('✅ Localizações encontradas:', formattedLocations.length);
    return NextResponse.json(formattedLocations);
    
  } catch (error) {
    console.error('❌ Erro ao buscar localizações:', error);
    return NextResponse.json(
      { message: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
} 