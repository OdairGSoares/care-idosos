import { NextRequest, NextResponse } from 'next/server'
import { PrismaAppointmentService } from '../../services/prisma/appointmentService.prisma'

export async function GET(request: NextRequest) {
  try {
    console.log('🧪 [TEST] Iniciando teste de conectividade do banco...');

    // Testar médicos
    console.log('👨‍⚕️ [TEST] Buscando médicos...');
    const doctors = await PrismaAppointmentService.getDoctors();
    console.log('✅ [TEST] Médicos encontrados:', doctors.length);

    // Testar localizações
    console.log('🏥 [TEST] Buscando localizações...');
    const locations = await PrismaAppointmentService.getLocations();
    console.log('✅ [TEST] Localizações encontradas:', locations.length);

    // Testar consultas (sem userId específico para ver se há dados)
    console.log('📅 [TEST] Testando conexão com appointments...');
    const testUserId = 'cmdl47pe90000105s3dxgr17q'; // ID do usuário de teste
    const appointments = await PrismaAppointmentService.getAppointments(testUserId);
    console.log('✅ [TEST] Consultas do usuário teste:', appointments.length);

    return NextResponse.json({
      success: true,
      message: 'Teste de conectividade realizado com sucesso',
      data: {
        doctors: {
          count: doctors.length,
          items: doctors.map(d => ({ id: d.id, name: d.name, specialty: d.specialty }))
        },
        locations: {
          count: locations.length,
          items: locations.map(l => ({ id: l.id, name: l.name, city: l.city }))
        },
        appointments: {
          count: appointments.length,
          testUserId: testUserId
        }
      }
    });

  } catch (error) {
    console.error('❌ [TEST] Erro no teste de conectividade:', error);
    console.error('❌ [TEST] Stack trace:', error instanceof Error ? error.stack : 'N/A');
    
    return NextResponse.json({
      success: false,
      message: 'Erro no teste de conectividade',
      error: error instanceof Error ? error.message : 'Erro desconhecido'
    }, { status: 500 });
  }
} 