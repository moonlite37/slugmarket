import { Request } from 'express';
import { AuthService } from './service';
import { SessionUser } from '..';

export async function expressAuthentication(
  request: Request,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  securityName: string,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  scopes?: string[],
): Promise<SessionUser> {
  const authToken = request.cookies.authToken;
  if (!authToken) {
    throw new Error('No AuthToken');
  }
  const user = await new AuthService().check(authToken);
  request.user = user;
  return user;
}
