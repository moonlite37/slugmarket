import { Request } from 'express';
import { AuthService } from './service';
import { SessionUser } from '..';

export async function expressAuthentication(
  request: Request,
  securityName: string,
  scopes?: string[],
): Promise<SessionUser> {
  console.log(securityName, scopes);
  const authToken = request.cookies.authToken;
  if (!authToken) {
    throw new Error('No AuthToken');
  }
  const user = await new AuthService().check(authToken);
  request.user = user;
  return user;
}
