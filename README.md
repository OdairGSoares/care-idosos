# 🏥 Care Idosos - Sistema Completo de Cuidados

<div align="center">
  <img src="./imagens/LOGO-CI.png" width="120" height="120" alt="Care Idosos Logo"/>
  
  ### Sistema completo de cuidados para idosos com tecnologia moderna
  
  [![React](https://img.shields.io/badge/React-18.0-blue?logo=react)](https://reactjs.org/)
  [![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?logo=typescript)](https://www.typescriptlang.org/)
  [![Prisma](https://img.shields.io/badge/Prisma-5.0-black?logo=prisma)](https://www.prisma.io/)
  [![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15-blue?logo=postgresql)](https://www.postgresql.org/)
  [![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.0-38B2AC?logo=tailwind-css)](https://tailwindcss.com/)
  [![Vercel](https://img.shields.io/badge/Deploy-Vercel-black?logo=vercel)](https://vercel.com/)
</div>

---

## 📋 Índice

- [🎯 Sobre o Projeto](#-sobre-o-projeto)
- [🚀 Funcionalidades](#-funcionalidades)
- [🛠️ Tecnologias](#️-tecnologias)
- [📁 Arquitetura](#-arquitetura)
- [💻 Como Executar](#-como-executar)
- [🗄️ Banco de Dados](#️-banco-de-dados)
- [🔐 Autenticação](#-autenticação)
- [📱 Interface](#-interface)
- [🚀 Deploy](#-deploy)
- [👥 Colaboradores](#-colaboradores)
- [📄 Licença](#-licença)

---

## 🎯 Sobre o Projeto

O **Care Idosos** é uma plataforma completa desenvolvida para oferecer serviços essenciais aos idosos, disponível 24 horas por dia. O sistema busca aprimorar a qualidade de vida dos idosos, assegurando acesso rápido, fácil e contínuo a cuidados de saúde e suporte sempre que necessário.

### 🎯 Objetivos Principais

- ✅ **Gerenciamento de Consultas Médicas**: Agendamento e acompanhamento
- ✅ **Administração de Medicamentos**: Controle de horários e lembretes
- ✅ **Contatos de Emergência**: Acesso rápido a familiares e serviços
- ✅ **Interface Intuitiva**: Design adaptado para idosos
- ✅ **Segurança**: Autenticação JWT e dados protegidos

---

## 🚀 Funcionalidades

### 🔐 **Autenticação e Segurança**
- Cadastro e login de usuários
- Autenticação JWT segura
- Proteção de rotas
- Gerenciamento de sessão

### 💊 **Gerenciamento de Medicamentos**
- ✅ Cadastrar medicamentos com horários
- ✅ Controle de status (tomado/não tomado)
- ✅ Sistema de lembretes
- ✅ Reset diário automático
- ✅ Histórico de medicamentos

### 📅 **Agendamento de Consultas**
- ✅ Agendar consultas médicas
- ✅ Seleção de médicos e especialidades
- ✅ Escolha de clínicas e localizações
- ✅ Confirmação de presença
- ✅ Histórico de consultas

### 🚨 **Contatos de Emergência**
- ✅ Cadastrar contatos importantes
- ✅ Definir contato principal
- ✅ Categorização por relacionamento
- ✅ Acesso rápido em emergências

### 👨‍⚕️ **Médicos e Clínicas**
- ✅ Listagem de médicos por especialidade
- ✅ Informações de clínicas
- ✅ Busca por localização
- ✅ Dados de contato

### 📱 **Interface Responsiva**
- ✅ Design mobile-first
- ✅ Acessibilidade para idosos
- ✅ Navegação intuitiva
- ✅ Feedback visual claro

---

## 🛠️ Tecnologias

### **Frontend**
- **React 18** - Biblioteca JavaScript para interfaces
- **TypeScript** - Tipagem estática
- **Vite** - Build tool e servidor de desenvolvimento
- **Tailwind CSS** - Framework CSS utilitário
- **shadcn/ui** - Componentes de interface
- **React Router** - Roteamento
- **TanStack Query** - Gerenciamento de estado
- **Sonner** - Sistema de notificações

### **Backend & Database**
- **Prisma ORM** - ORM moderno para TypeScript
- **PostgreSQL** - Banco de dados relacional
- **JWT** - Autenticação baseada em tokens
- **bcryptjs** - Hash de senhas
- **Vercel** - Deploy e hosting

### **Ferramentas de Desenvolvimento**
- **ESLint** - Linting de código
- **Prettier** - Formatação de código
- **Git** - Controle de versão

---

## 📁 Arquitetura

```
care-idosos/
├── 📁 app/                    # Aplicação Next.js
│   ├── 📁 api/               # Rotas da API
│   │   ├── 📁 appointments/  # Endpoints de agendamentos
│   │   ├── 📁 medications/   # Endpoints de medicamentos
│   │   ├── 📁 users/         # Endpoints de usuários
│   │   └── 📁 emergency-contacts/ # Endpoints de contatos
│   ├── 📁 components/        # Componentes React
│   │   ├── 📁 ui/           # Componentes de interface
│   │   └── ...              # Componentes específicos
│   ├── 📁 pages/            # Páginas da aplicação
│   ├── 📁 services/         # Serviços da API
│   │   └── 📁 prisma/       # Serviços Prisma ORM
│   ├── 📁 hooks/            # Hooks personalizados
│   ├── 📁 types/            # Tipos TypeScript
│   └── 📁 utils/            # Utilitários
├── 📁 prisma/               # Configuração Prisma
│   ├── 📄 schema.prisma     # Schema do banco
│   ├── 📁 migrations/       # Migrações do banco
│   └── 📄 seed.ts          # Dados de exemplo
├── 📁 public/              # Arquivos estáticos
├── 📁 imagens/             # Imagens do projeto
└── 📄 README.md            # Documentação
```

---

## 💻 Como Executar

### **Pré-requisitos**
- Node.js 18+ 
- npm ou yarn
- PostgreSQL (local ou na nuvem)

### **1. Clone o Repositório**
```bash
git clone https://github.com/seu-usuario/care-idosos.git
cd care-idosos
```

### **2. Instale as Dependências**
```bash
npm install
```

### **3. Configure as Variáveis de Ambiente**

Crie um arquivo `.env.local` na raiz do projeto:

```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/care_idosos?schema=public"

# JWT
VITE_JWT_SECRET="seu-jwt-secret-super-seguro"

# API
VITE_API_URL="http://localhost:3000/api"
```

### **4. Configure o Banco de Dados**

```bash
# Gerar cliente Prisma
npm run db:generate

# Executar migrações
npm run db:migrate

# Popular banco com dados de exemplo
npm run db:seed

# (Opcional) Abrir Prisma Studio
npm run db:studio
```

### **5. Execute o Projeto**

```bash
# Desenvolvimento
npm run dev

# Build para produção
npm run build

# Preview do build
npm run preview
```

### **6. Acesse a Aplicação**

- **Frontend**: http://localhost:5173
- **Prisma Studio**: http://localhost:5555

---

## 🗄️ Banco de Dados

### **Schema Principal (Prisma)**

```prisma
// Usuários
model User {
  id            String @id @default(cuid())
  userFirstName String
  userLastName  String
  phone         String
  email         String @unique
  password      String // Hash bcrypt
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt

  // Relacionamentos
  medications       Medication[]
  appointments      Appointment[]
  emergencyContacts EmergencyContact[]
}

// Medicamentos
model Medication {
  id       String  @id @default(cuid())
  name     String
  dosage   Float
  time     String
  reminder Boolean @default(false)
  taken    Boolean @default(false)
  userId   String
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)
}

// Agendamentos
model Appointment {
  id         String   @id @default(cuid())
  date       String
  time       String
  confirmed  Boolean  @default(false)
  userId     String
  doctorId   String
  locationId String
  createdAt  DateTime @default(now())
  updatedAt  DateTime @updatedAt

  user     User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  doctor   Doctor   @relation(fields: [doctorId], references: [id])
  location Location @relation(fields: [locationId], references: [id])
}

// Contatos de Emergência
model EmergencyContact {
  id            String @id @default(cuid())
  name          String
  phone         String
  relationship  String
  isMainContact Boolean @default(false)
  userId        String
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)
}
```

### **Scripts de Banco de Dados**

```bash
# Gerar cliente Prisma
npm run db:generate

# Push schema para DB (desenvolvimento)
npm run db:push

# Executar migrações (produção)
npm run db:migrate

# Popular com dados de exemplo
npm run db:seed

# Abrir Prisma Studio
npm run db:studio

# Reset do banco
npm run db:reset
```

---

## 🔐 Autenticação

### **Sistema JWT**

```typescript
// Login
const handleLogin = async (credentials: LoginData) => {
  const response = await axios.post('/api/users/login', credentials);
  const { token } = response.data;
  
  // Salvar token
  localStorage.setItem('authToken', token);
  localStorage.setItem('userId', response.data.userId);
};

// Verificar autenticação
const isAuthenticated = () => {
  const token = localStorage.getItem('authToken');
  return !!token;
};

// Logout
const handleLogout = () => {
  localStorage.removeItem('authToken');
  localStorage.removeItem('userId');
  navigate('/login');
};
```

### **Proteção de Rotas**

```typescript
// Componente ProtectedRoute
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const isAuthenticated = UserService.isLoggedIn();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  return <>{children}</>;
};
```

---

## 📱 Interface

### **Design System**

- **Cores**: Paleta personalizada para idosos
- **Tipografia**: Fonte legível (Montserrat)
- **Componentes**: shadcn/ui + Tailwind CSS
- **Responsividade**: Mobile-first design

### **Componentes Principais**

```typescript
// Exemplo de uso dos componentes
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';

// Página de medicamentos
function MedicationsPage() {
  return (
    <div className="container mx-auto px-4 py-6">
      <Card>
        <CardHeader>
          <CardTitle>Meus Medicamentos</CardTitle>
        </CardHeader>
        <CardContent>
          {/* Conteúdo */}
        </CardContent>
      </Card>
    </div>
  );
}
```

### **Responsividade**

```css
/* Breakpoints Tailwind */
sm: 640px   /* Mobile */
md: 768px   /* Tablet */
lg: 1024px  /* Desktop */
xl: 1280px  /* Large Desktop */
```

---

## 🚀 Deploy

### **Vercel (Recomendado)**

1. **Conecte o Repositório**
   ```bash
   # Via Git
   git push origin main
   ```

2. **Configure as Variáveis de Ambiente**
   - `DATABASE_URL`: URL do PostgreSQL
   - `VITE_JWT_SECRET`: Chave JWT
   - `VITE_API_URL`: URL da API

3. **Deploy Automático**
   - Vercel detecta mudanças automaticamente
   - Build e deploy automáticos

### **Outras Opções**

```bash
# Build estático
npm run build

# Preview local
npm run preview

# Deploy manual
npm run deploy
```

---

## 📊 Endpoints da API

### **Autenticação**
```http
POST /api/users/signup    # Cadastro
POST /api/users/login     # Login
GET  /api/users/:id       # Buscar usuário
```

### **Medicamentos**
```http
GET    /api/medications           # Listar
POST   /api/medications           # Criar
PUT    /api/medications/:id       # Atualizar
DELETE /api/medications/:id       # Remover
DELETE /api/medications/reset     # Resetar todos
```

### **Agendamentos**
```http
GET    /api/appointments          # Listar
POST   /api/appointments          # Criar
PUT    /api/appointments/:id      # Atualizar
DELETE /api/appointments/:id      # Cancelar
PUT    /api/appointments/confirmed/:id  # Confirmar
```

### **Contatos de Emergência**
```http
GET    /api/emergency-contacts    # Listar
POST   /api/emergency-contacts    # Criar
PUT    /api/emergency-contacts/:id # Atualizar
DELETE /api/emergency-contacts/:id # Remover
```

### **Dados Globais**
```http
GET /api/doctors    # Listar médicos
GET /api/locations  # Listar clínicas
```

---

## 🧪 Testando

### **Usuário de Teste**
```
Email: joao@teste.com
Senha: 123456
```

### **Dados de Exemplo**
O seed do banco cria:
- 5 usuários de exemplo
- 10 medicamentos
- 8 agendamentos
- 6 contatos de emergência
- 15 médicos
- 12 clínicas

---

## 👥 Colaboradores

### **Equipe de Desenvolvimento**

| Nome | Função | GitHub |
|------|--------|--------|
| **Beatriz Ribeiro dos Santos** | Desenvolvedora Frontend | [@beatriz-ribeiro](https://github.com/beatriz-ribeiro) |
| **Elisabete Alves dos Santos** | Desenvolvedora Backend | [@elisabete-alves](https://github.com/elisabete-alves) |
| **Karenn Souza Bueno de Azevedo** | Desenvolvedora Full Stack | [@karenn-souza](https://github.com/karenn-souza) |
| **Kelven Martins da Rosa** | Desenvolvedor Frontend | [@kelven-martins](https://github.com/kelven-martins) |
| **Kevin Logan Gomes Pires** | Desenvolvedor Backend | [@kevin-pires](https://github.com/kevin-pires) |
| **Marlu Patrocinio Ramos da Silva** | Desenvolvedora UI/UX | [@marlu-ramos](https://github.com/marlu-ramos) |
| **Odair Gomes Soares** | Desenvolvedor Full Stack | [@odair-soares](https://github.com/odair-soares) |

### **Instituição**
- **SENAC** - Serviço Nacional de Aprendizagem Comercial

---

## 📄 Licença

Este projeto está licenciado sob a **MIT License** - veja o arquivo [LICENSE.txt](./LICENSE.txt) para detalhes.

---

## 🤝 Contribuição

1. **Fork** o projeto
2. Crie sua **Feature Branch** (`git checkout -b feature/AmazingFeature`)
3. **Commit** suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. **Push** para a branch (`git push origin feature/AmazingFeature`)
5. Abra um **Pull Request**

### **Padrões de Contribuição**

- Use **TypeScript** para todo código novo
- Siga os padrões do **ESLint** e **Prettier**
- Adicione **testes** para novas funcionalidades
- Documente mudanças na API
- Mantenha a **responsividade** mobile-first

---

### **Care Idosos** - Sistema completo de cuidados para idosos

**Desenvolvido com ❤️ para facilitar o cuidado com idosos**

[![GitHub stars](https://img.shields.io/github/stars/seu-usuario/care-idosos?style=social)](https://github.com/seu-usuario/care-idosos)
[![GitHub forks](https://img.shields.io/github/forks/seu-usuario/care-idosos?style=social)](https://github.com/seu-usuario/care-idosos)
[![GitHub issues](https://img.shields.io/github/issues/seu-usuario/care-idosos)](https://github.com/seu-usuario/care-idosos/issues)

</div>
