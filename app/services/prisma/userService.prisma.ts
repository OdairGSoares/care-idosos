import { prisma } from '../../../lib/prisma'
import { hashPassword, verifyPassword, generateToken } from '../../../lib/auth'
import type {
  IUserData,
  IUserDataWithoutUserId,
  IUserDataWithoutPassword,
  IUserDataLogin,
  IUserToken
} from '../../types/api'

/**
 * Serviços para gerenciamento de usuários com Prisma
 */
export class PrismaUserService {
  
  /**
   * Cadastra um novo usuário
   */
  static async signUp(userData: IUserDataWithoutUserId): Promise<IUserData | null> {
    try {
      // Verificar se e-mail já existe
      const existingUser = await prisma.user.findUnique({
        where: { email: userData.email }
      })

      if (existingUser) {
        throw new Error('E-mail já cadastrado')
      }

      // Hash da senha
      const hashedPassword = await hashPassword(userData.password)

      // Criar usuário
      const user = await prisma.user.create({
        data: {
          userFirstName: userData.userFirstName,
          userLastName: userData.userLastName,
          phone: userData.phone,
          email: userData.email,
          password: hashedPassword,
        }
      })

      return {
        userId: user.id,
        userFirstName: user.userFirstName,
        userLastName: user.userLastName,
        phone: user.phone,
        email: user.email,
        password: user.password, // Retornando hash por compatibilidade
      }
    } catch (error) {
      console.error('Erro ao cadastrar usuário:', error)
      return null
    }
  }

  /**
   * Realiza login do usuário
   */
  static async login(credentials: IUserDataLogin): Promise<IUserToken | null> {
    try {
      // Buscar usuário por email
      const user = await prisma.user.findUnique({
        where: { email: credentials.email }
      })

      if (!user) {
        throw new Error('Usuário não encontrado')
      }

      // Verificar senha
      const isValidPassword = await verifyPassword(credentials.password, user.password)
      if (!isValidPassword) {
        throw new Error('Senha incorreta')
      }

      // Gerar token
      const token = generateToken({
        userId: user.id,
        email: user.email
      })

      return {
        userId: user.id,
        token,
        email: user.email
      }
    } catch (error) {
      console.error('Erro ao fazer login:', error)
      return null
    }
  }

  /**
   * Lista todos os usuários (sem senha)
   */
  static async getUsers(): Promise<IUserDataWithoutPassword[] | null> {
    try {
      const users = await prisma.user.findMany({
        select: {
          id: true,
          userFirstName: true,
          userLastName: true,
          phone: true,
          email: true,
        }
      })

      return users.map(user => ({
        userId: user.id,
        userFirstName: user.userFirstName,
        userLastName: user.userLastName,
        phone: user.phone,
        email: user.email,
      }))
    } catch (error) {
      console.error('Erro ao buscar usuários:', error)
      return null
    }
  }

  /**
   * Busca um usuário específico por ID
   */
  static async getUserById(userId: string): Promise<IUserDataWithoutPassword | null> {
    try {
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: {
          id: true,
          userFirstName: true,
          userLastName: true,
          phone: true,
          email: true,
        }
      })

      if (!user) {
        return null
      }

      return {
        userId: user.id,
        userFirstName: user.userFirstName,
        userLastName: user.userLastName,
        phone: user.phone,
        email: user.email,
      }
    } catch (error) {
      console.error('Erro ao buscar usuário por ID:', error)
      return null
    }
  }

  /**
   * Atualiza dados do usuário
   */
  static async updateUser(userId: string, userData: Partial<IUserDataWithoutUserId>): Promise<IUserDataWithoutPassword | null> {
    try {
      const updateData: any = { ...userData }

      // Se há senha nova, fazer hash
      if (updateData.password) {
        updateData.password = await hashPassword(updateData.password)
      }

      const user = await prisma.user.update({
        where: { id: userId },
        data: updateData,
        select: {
          id: true,
          userFirstName: true,
          userLastName: true,
          phone: true,
          email: true,
        }
      })

      return {
        userId: user.id,
        userFirstName: user.userFirstName,
        userLastName: user.userLastName,
        phone: user.phone,
        email: user.email,
      }
    } catch (error) {
      console.error('Erro ao atualizar usuário:', error)
      return null
    }
  }

  /**
   * Remove um usuário
   */
  static async deleteUser(userId: string): Promise<boolean> {
    try {
      await prisma.user.delete({
        where: { id: userId }
      })
      return true
    } catch (error) {
      console.error('Erro ao deletar usuário:', error)
      return false
    }
  }
} 