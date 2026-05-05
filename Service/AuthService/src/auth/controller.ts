import { Route, Controller, Post, Body, Response, Get, Query } from 'tsoa';

import { Credentials, Authenticated } from '.';
import { AuthService } from './service';

@Route('')
export class AuthController extends Controller {
  @Post('login')
  @Response('401', 'Unauthorized')
  public async login(
    @Body() credentials: Credentials,
  ): Promise<Authenticated | undefined> {
    const user = await new AuthService().login(credentials);
    if (!user) {
      this.setStatus(401);
      return undefined;
    }
    return user;
  }

  @Get('oauthlogin')
  public async oauthLogin(): Promise<void> {
    await new AuthService().oauthLogin().then((url) => {
      this.setStatus(302);
      this.setHeader('Location', url);
    });
  }

  @Get('oauthlogin/callback')
  public async oauthLoginCallback(
    @Query('code') authCode: string,
  ): Promise<void> {
    await new AuthService().oauthLoginCallback(authCode).then((authToken) => {
      this.setHeader(
        'Set-Cookie',
        `session=${authToken}; HttpOnly; SameSite=Lax; Path=/; Max-Age=${2 * 60 * 60}`,
      );
      this.setStatus(302);
      this.setHeader('Location', process.env.CLIENT_URL);
    });
  }
}
