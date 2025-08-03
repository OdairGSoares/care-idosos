import { NextRequest, NextResponse } from 'next/server'
import { PrismaHealthDataService } from '../../services/prisma/healthDataService.prisma'

export async function GET(request: NextRequest) {
  try {
    console.log('🧪 [TEST] Testando serviço de health data...')
    
    // Teste simples - buscar dados de um usuário específico
    const testUserId = 'cmdnu1ype0000tenon1sqf8h6' // ID do usuário de teste
    
    console.log('🔍 [TEST] Buscando todos os dados para usuário:', testUserId)
    const allData = await PrismaHealthDataService.getAllHealthData(testUserId)
    
    console.log('🔍 [TEST] Buscando dados de pressão arterial')
    const bloodPressureData = await PrismaHealthDataService.getHealthDataByType(testUserId, 'bloodPressure')
    
    console.log('✅ [TEST] Teste concluído com sucesso')
    
    return NextResponse.json({
      success: true,
      message: 'Teste realizado com sucesso',
      data: {
        totalRecords: allData.length,
        bloodPressureRecords: bloodPressureData.length,
        sampleData: allData.slice(0, 3), // Primeiros 3 registros
        userId: testUserId
      }
    })
    
  } catch (error) {
    console.error('❌ [TEST] Erro no teste:', error)
    console.error('❌ [TEST] Stack trace:', error instanceof Error ? error.stack : 'N/A')
    
    return NextResponse.json(
      { 
        success: false,
        message: 'Erro no teste',
        error: error instanceof Error ? error.message : 'Erro desconhecido',
        stack: error instanceof Error ? error.stack : 'N/A'
      },
      { status: 500 }
    )
  }
} 