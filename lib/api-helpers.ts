export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  message?: string
  error?: string
}

export function successResponse<T>(data: T, message?: string): Response {
  return new Response(JSON.stringify({
    success: true,
    data,
    message
  } as ApiResponse<T>), {
    headers: { 'Content-Type': 'application/json' }
  })
}

export function errorResponse(message: string, status: number = 400): Response {
  return new Response(JSON.stringify({
    success: false,
    error: message
  } as ApiResponse), { 
    status,
    headers: { 'Content-Type': 'application/json' }
  })
}

export function unauthorizedResponse(): Response {
  return errorResponse('Token inválido ou não fornecido', 401)
}

export function notFoundResponse(resource: string = 'Recurso'): Response {
  return errorResponse(`${resource} não encontrado`, 404)
}

export function validationErrorResponse(message: string): Response {
  return errorResponse(`Erro de validação: ${message}`, 422)
}

export async function withAuth<T>(
  request: Request,
  handler: (userId: string) => Promise<T>
): Promise<Response | T> {
  const token = request.headers.get('authorization')?.replace('Bearer ', '')
  
  if (!token) {
    return unauthorizedResponse()
  }

  const { verifyToken } = await import('./auth')
  const payload = verifyToken(token)
  
  if (!payload) {
    return unauthorizedResponse()
  }

  return handler(payload.userId)
} 