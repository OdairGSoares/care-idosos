import { NextRequest, NextResponse } from 'next/server'
import { PrismaMedicationService } from '../../../services/prisma/medicationService.prisma'
import { validateUserAccess } from '../auth-helper'

export async function DELETE(request: NextRequest) {
  try {
    // Validar acesso do usuário
    const { userId, error } = validateUserAccess(request);
    
    if (!userId) {
      return NextResponse.json(
        { message: error || 'Acesso não autorizado' },
        { status: 401 }
      );
    }

    console.log('🧹 Resetando todos os medicamentos do usuário:', userId);

    // Primeiro buscar quantos medicamentos o usuário tem
    const userMedications = await PrismaMedicationService.getMedications(userId);
    
    if (!userMedications || userMedications.length === 0) {
      return NextResponse.json({
        success: true,
        message: 'Usuário não possui medicamentos para remover',
        deletedCount: 0
      });
    }

    const medicationCount = userMedications.length;
    console.log(`📊 Encontrados ${medicationCount} medicamentos para remover`);

    // Usar serviço Prisma para deletar todos os medicamentos do usuário
    const result = await PrismaMedicationService.deleteAllMedications(userId);
    
    if (result === null) {
      return NextResponse.json(
        { message: 'Erro ao resetar medicamentos' },
        { status: 500 }
      );
    }

    console.log('✅ Todos os medicamentos resetados com sucesso');

    return NextResponse.json({
      success: true,
      message: `Todos os ${medicationCount} medicamentos foram removidos com sucesso!`,
      deletedCount: medicationCount
    });

  } catch (error) {
    console.error('❌ Erro ao resetar medicamentos:', error);
    return NextResponse.json(
      { message: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
} 