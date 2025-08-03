import { NextRequest, NextResponse } from 'next/server'
import { PrismaMedicationService } from '../../services/prisma/medicationService.prisma'
import { validateUserAccess } from './auth-helper'

export async function GET(request: NextRequest) {
  try {
    // Validar acesso do usuário
    const { userId, error } = validateUserAccess(request);
    
    if (!userId) {
      return NextResponse.json(
        { message: error || 'Acesso não autorizado' },
        { status: 401 }
      );
    }

    console.log('🔍 Buscando medicamentos para userId:', userId);

    // Usar serviço Prisma real
    const medications = await PrismaMedicationService.getMedications(userId);

    if (medications === null) {
      return NextResponse.json(
        { message: 'Erro ao buscar medicamentos' },
        { status: 500 }
      );
    }

    console.log('✅ Medicamentos encontrados:', medications.length);
    console.log('📋 Dados dos medicamentos:', medications);

    // Mapear para o formato esperado pelo frontend
    const formattedMedications = medications.map(med => ({
      id: med.id, // Usar ID real direto como string
      medicationName: med.name,
      medicationTime: med.time,
      taken: med.taken || false,
      name: med.name,
      time: med.time,
      dosage: `${med.dosage}mg`,
      reminder: med.reminder || false
    }));

    return NextResponse.json(formattedMedications)
  } catch (error) {
    console.error('❌ Erro ao buscar medicamentos:', error)
    return NextResponse.json(
      { message: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    // Validar acesso do usuário
    const { userId, error } = validateUserAccess(request);
    
    if (!userId) {
      return NextResponse.json(
        { message: error || 'Acesso não autorizado' },
        { status: 401 }
      );
    }

    const { name, dosage, time } = await request.json()
    
    // Validar dados
    if (!name || !dosage || !time) {
      return NextResponse.json(
        { message: 'Nome, dosagem e horário são obrigatórios' },
        { status: 400 }
      )
    }

    console.log('➕ Adicionando medicamento:', { name, dosage, time, userId });

    // Extrair número da dosagem (ex: "50mg" -> 50)
    const dosageNumber = typeof dosage === 'string' 
      ? parseFloat(dosage.replace(/[^\d.]/g, '')) 
      : dosage;

    // Usar serviço Prisma real
    const result = await PrismaMedicationService.addMedication({
      name,
      dosage: dosageNumber,
      time
    }, userId);

    if (result === null) {
      return NextResponse.json(
        { message: 'Erro ao adicionar medicamento' },
        { status: 500 }
      );
    }

    console.log('✅ Medicamento adicionado com sucesso');

    return NextResponse.json(
      { 
        success: true, 
        message: result
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('❌ Erro ao adicionar medicamento:', error)
    return NextResponse.json(
      { message: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
} 