import { PrismaClient } from '@prisma/client'
import { hashPassword } from '../lib/auth'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Iniciando seed do banco de dados...')

  // Limpar dados existentes
  await prisma.healthData.deleteMany()
  await prisma.emergencyContact.deleteMany()
  await prisma.appointment.deleteMany()
  await prisma.medication.deleteMany()
  await prisma.user.deleteMany()
  await prisma.doctor.deleteMany()
  await prisma.location.deleteMany()

  // Criar usuário de teste
  const hashedPassword = await hashPassword('123456')
  const testUser = await prisma.user.create({
    data: {
      userFirstName: 'João',
      userLastName: 'Silva',
      email: 'joao@teste.com',
      phone: '(11) 99999-9999',
      password: hashedPassword,
    }
  })

  console.log('👤 Usuário de teste criado:', testUser.id)

  // Criar médicos
  const doctors = await Promise.all([
    prisma.doctor.create({
      data: {
        name: 'Dr. Carlos Mendes',
        specialty: 'Cardiologia',
        image: 'https://via.placeholder.com/150x150?text=Dr.Carlos'
      }
    }),
    prisma.doctor.create({
      data: {
        name: 'Dra. Ana Santos',
        specialty: 'Geriatria',
        image: 'https://via.placeholder.com/150x150?text=Dra.Ana'
      }
    }),
    prisma.doctor.create({
      data: {
        name: 'Dr. Roberto Lima',
        specialty: 'Neurologia',
        image: 'https://via.placeholder.com/150x150?text=Dr.Roberto'
      }
    })
  ])

  console.log('👨‍⚕️ Médicos criados:', doctors.length)

  // Criar localizações
  const locations = await Promise.all([
    prisma.location.create({
      data: {
        name: 'Hospital São Paulo',
        address: 'Rua das Flores, 123',
        city: 'São Paulo'
      }
    }),
    prisma.location.create({
      data: {
        name: 'Clínica Vida Saudável',
        address: 'Av. Paulista, 456',
        city: 'São Paulo'
      }
    }),
    prisma.location.create({
      data: {
        name: 'Centro Médico Santa Rita',
        address: 'Rua dos Cuidados, 789',
        city: 'São Paulo'
      }
    })
  ])

  console.log('🏥 Localizações criadas:', locations.length)

  // Criar medicamentos de exemplo
  await prisma.medication.createMany({
    data: [
      {
        name: 'Losartana',
        dosage: 50,
        time: '08:00',
        reminder: true,
        taken: false,
        userId: testUser.id
      },
      {
        name: 'Metformina',
        dosage: 500,
        time: '12:00',
        reminder: true,
        taken: true,
        userId: testUser.id
      },
      {
        name: 'Sinvastatina',
        dosage: 20,
        time: '20:00',
        reminder: false,
        taken: false,
        userId: testUser.id
      }
    ]
  })

  console.log('💊 Medicamentos criados')

  // Criar agendamentos de exemplo
  await prisma.appointment.createMany({
    data: [
      {
        date: '2024-02-15',
        time: '14:00',
        confirmed: false,
        userId: testUser.id,
        doctorId: doctors[0].id,
        locationId: locations[0].id
      },
      {
        date: '2024-02-20',
        time: '10:30',
        confirmed: true,
        userId: testUser.id,
        doctorId: doctors[1].id,
        locationId: locations[1].id
      }
    ]
  })

  console.log('📅 Agendamentos criados')

  // Criar contatos de emergência de exemplo
  await prisma.emergencyContact.createMany({
    data: [
      {
        name: 'Maria Silva',
        phone: '(11) 98765-4321',
        relationship: 'Filha',
        isMainContact: true,
        userId: testUser.id
      },
      {
        name: 'Dr. Pedro Oliveira',
        phone: '(11) 99876-5432',
        relationship: 'Médico de família',
        isMainContact: false,
        userId: testUser.id
      }
    ]
  })

  console.log('🚨 Contatos de emergência criados')

  // Criar dados de saúde de exemplo
  const today = new Date()
  const healthDataSample = []
  
  // Gerar dados dos últimos 7 dias
  for (let i = 6; i >= 0; i--) {
    const date = new Date(today)
    date.setDate(today.getDate() - i)
    const dateStr = date.toISOString().split('T')[0]
    
    // Pressão arterial (sistólica/diastólica)
    healthDataSample.push({
      type: 'bloodPressure',
      value: Math.floor(Math.random() * 20) + 110, // Sistólica entre 110-130
      secondaryValue: Math.floor(Math.random() * 15) + 70, // Diastólica entre 70-85
      date: dateStr,
      userId: testUser.id
    })
    
    // Frequência cardíaca
    healthDataSample.push({
      type: 'heartRate',
      value: Math.floor(Math.random() * 20) + 65, // Entre 65-85
      date: dateStr,
      userId: testUser.id
    })
    
    // Glicose
    healthDataSample.push({
      type: 'glucose',
      value: Math.floor(Math.random() * 40) + 80, // Entre 80-120
      date: dateStr,
      userId: testUser.id
    })
    
    // Peso (a cada dois dias)
    if (i % 2 === 0) {
      healthDataSample.push({
        type: 'weight',
        value: Math.round((Math.random() * 5 + 70) * 10) / 10, // Entre 70-75kg
        date: dateStr,
        userId: testUser.id
      })
    }
    
    // Temperatura (a cada três dias)
    if (i % 3 === 0) {
      healthDataSample.push({
        type: 'temperature',
        value: Math.round((Math.random() * 1 + 36) * 10) / 10, // Entre 36-37°C
        date: dateStr,
        userId: testUser.id
      })
    }
  }

  await prisma.healthData.createMany({
    data: healthDataSample
  })

  console.log('📊 Dados de saúde criados:', healthDataSample.length)

  console.log('✅ Seed concluído com sucesso!')
  console.log('📧 Usuário de teste: joao@teste.com')
  console.log('🔑 Senha: 123456')
}

main()
  .catch((e) => {
    console.error('❌ Erro no seed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  }) 