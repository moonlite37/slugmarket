import { Controller, Get, Route } from 'tsoa';
import { AuthService } from './service';

@Route('login')
export class AuthController extends Controller {
  @Get()
  public async login(): Promise<void> {
    await new AuthService().login().then(url => {
      this.setStatus(302);
      this.setHeader('Location', url);
    });
  }
}
