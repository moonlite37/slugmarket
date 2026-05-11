import { Request } from 'express';
import { AuthService } from './service';

export async function expressAuthentication(
  request: Request,
  securityName: string,
  scopes?: string[],
): Promise<void> {
  console.log(securityName, scopes);
  const authToken = request.cookies.authToken;
  if (!authToken) {
    throw new Error('No AuthToken');
  }
  request.user = await new AuthService().check(authToken);
}
