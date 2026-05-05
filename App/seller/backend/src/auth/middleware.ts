import { Request } from 'express';
import { AuthService } from './service';

export async function expressAuthentication(req: Request): Promise<object> {
  const token = req.cookies?.session;

  if (!token) {
    throw new Error('Unauthorized');
  }

  try {
    return new AuthService().check(token);
  } catch {
    throw new Error('Invalid or expired session');
  }
}
