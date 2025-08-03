import { NextRequest, NextResponse } from 'next/server'
import { PrismaMedicationService } from '../../../services/prisma/medicationService.prisma'
import { validateUserAccess } from '../auth-helper'

type RouteParams = {
  params: Promise<{ id: string }>
}

export async function GET(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    // Validar acesso do usuário
    const { userId, error } = validateUserAccess(request);
    
    if (!userId) {
      return NextResponse.json(
        { message: error || 'Acesso não autorizado' },
        { status: 401 }
      );
    }

    const { id } = await params
    console.log('🔍 Buscando medicamento ID:', id, 'para usuário:', userId);

    // Buscar diretamente pelo ID real (agora sempre string)
    const medication = await PrismaMedicationService.getMedicationById(id, userId);
    
    if (!medication) {
      return NextResponse.json(
        { message: 'Medicamento não encontrado ou você não tem acesso a ele' },
        { status: 404 }
      )
    }

    console.log('✅ Medicamento encontrado:', medication);

    // Mapear para o formato esperado pelo frontend
    const formattedMedication = {
      id: parseInt(medication.id.slice(-6)),
      medicationName: medication.name,
      medicationTime: medication.time,
      taken: medication.taken || false,
      name: medication.name,
      time: medication.time,
      dosage: `${medication.dosage}mg`,
      reminder: medication.reminder || false
    };

    return NextResponse.json(formattedMedication)
  } catch (error) {
    console.error('❌ Erro ao buscar medicamento:', error)
    return NextResponse.json(
      { message: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    // Validar acesso do usuário
    const { userId, error } = validateUserAccess(request);
    
    if (!userId) {
      return NextResponse.json(
        { message: error || 'Acesso não autorizado' },
        { status: 401 }
      );
    }

    const { id } = await params
    const updateData = await request.json()
    
    console.log('✏️ Atualizando medicamento ID:', id, 'dados:', updateData);

    // Primeiro encontrar o medicamento real por ID
    let medicationId = id;
    
    // Se é um ID numérico, encontrar o ID real do Prisma
    if (/^\d+$/.test(id)) {
      const allMedications = await PrismaMedicationService.getMedications(userId);
      if (allMedications) {
        const numericId = parseInt(id);
        const foundMed = allMedications.find(med => 
          parseInt(med.id.slice(-6)) === numericId
        );
        if (foundMed) {
          medicationId = foundMed.id;
        } else {
          return NextResponse.json(
            { message: 'Medicamento não encontrado' },
            { status: 404 }
          );
        }
      }
    }

    let result = null;

    // Verificar que tipo de atualização está sendo feita
    if ('taken' in updateData) {
      // Atualizar status de tomado
      result = await PrismaMedicationService.updateMedicationTaken(
        medicationId, 
        { taken: updateData.taken }, 
        userId
      );
    } else if ('reminder' in updateData) {
      // Atualizar lembrete
      result = await PrismaMedicationService.updateMedicationReminder(
        medicationId, 
        { reminder: updateData.reminder }, 
        userId
      );
    } else {
      return NextResponse.json(
        { message: 'Dados de atualização inválidos' },
        { status: 400 }
      );
    }
    
    if (result === null) {
      return NextResponse.json(
        { message: 'Medicamento não encontrado ou você não tem acesso a ele' },
        { status: 404 }
      )
    }

    console.log('✅ Medicamento atualizado com sucesso');

    return NextResponse.json({
      success: true,
      message: result
    })
  } catch (error) {
    console.error('❌ Erro ao atualizar medicamento:', error)
    return NextResponse.json(
      { message: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    // Validar acesso do usuário
    const { userId, error } = validateUserAccess(request);
    
    if (!userId) {
      return NextResponse.json(
        { message: error || 'Acesso não autorizado' },
        { status: 401 }
      );
    }

    const { id } = await params
    console.log('🗑️ Deletando medicamento ID:', id);
    
    // Primeiro encontrar o medicamento real por ID
    let medicationId = id;
    
    // Se é um ID numérico, encontrar o ID real do Prisma
    if (/^\d+$/.test(id)) {
      const allMedications = await PrismaMedicationService.getMedications(userId);
      if (allMedications) {
        const numericId = parseInt(id);
        const foundMed = allMedications.find(med => 
          parseInt(med.id.slice(-6)) === numericId
        );
        if (foundMed) {
          medicationId = foundMed.id;
        } else {
          return NextResponse.json(
            { message: 'Medicamento não encontrado' },
            { status: 404 }
          );
        }
      }
    }

    // Usar serviço Prisma real
    const result = await PrismaMedicationService.removeMedication(medicationId, userId);
    
    if (result === null) {
      return NextResponse.json(
        { message: 'Medicamento não encontrado ou você não tem acesso a ele' },
        { status: 404 }
      )
    }

    console.log('✅ Medicamento deletado com sucesso');

    return NextResponse.json({
      success: true,
      message: result
    })
  } catch (error) {
    console.error('❌ Erro ao deletar medicamento:', error)
    return NextResponse.json(
      { message: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
} 