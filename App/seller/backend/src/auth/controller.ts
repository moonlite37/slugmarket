import { Route, Controller, Get } from 'tsoa';
import { AuthService } from './service';

@Route('')
export class AuthController extends Controller {
  @Get('oauthlogin')
  public async oauthLogin(): Promise<{ url: string }> {
    const url = await new AuthService().oauthLogin();
    return { url };
  }
}