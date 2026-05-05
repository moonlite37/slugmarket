import { Controller, Get, Route, Query } from 'tsoa';
import { AuthService } from './service';

@Route('login')
export class AuthController extends Controller {
  @Get()
  public async login(): Promise<void> {
    await new AuthService().login().then((url) => {
      this.setStatus(302);
      this.setHeader('Location', url);
    });
  }

  @Get('callback')
  public async loginCallback(@Query('code') authCode: string): Promise<void> {
    await new AuthService().loginCallback(authCode).then((authToken) => {
      this.setHeader(
        'Set-Cookie',
        `session=${authToken}; HttpOnly; SameSite=Lax; Path=/; Max-Age=${2 * 60 * 60}`,
      );
      this.setStatus(302);
      this.setHeader('Location', process.env.CLIENT_URL);
    });
  }
}
