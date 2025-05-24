import { AuthenticatedRequest, Request } from 'express';
import { verify } from 'jsonwebtoken';

declare module 'express' {
  export interface  AuthenticatedRequest extends Request {
    user: {
      userId?: string;
      email?: string;
    }
  }
}

export async function expressAuthentication(
  request: Request,
  securityName: string,
  scopes?: string[],
): Promise<any> {
  const authHeader = request.headers.authorization;

  if (!authHeader?.startsWith('Bearer ')) {
     throw new Error('No token provided');
  }

  const token = authHeader.split(' ')[1];

  try {
    const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;
    if (!JWT_SECRET_KEY) {
      throw new Error('JWT_SECRET is not defined');
    }

    const decoded = verify(token, JWT_SECRET_KEY) as { userId: string; email: string };

    if (!decoded) {
      throw new Error("Invalid token");
    }

    (request as AuthenticatedRequest).user = {
      userId: decoded.userId,
      email: decoded.email,
    }

    return decoded;
  } catch (error) {
    console.error('Error verifying token:', error);
    throw new Error('Invalid or expired token');
  }
}
