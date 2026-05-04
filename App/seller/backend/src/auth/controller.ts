import { Controller, Get, Route } from 'tsoa';

@Route('auth')
export class AuthController extends Controller {
  @Get()
  public async getAuth(): Promise<unknown[]> {
    return [];
  }
}
