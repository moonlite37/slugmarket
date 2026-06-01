import { Route, Controller, Get, Query, Security } from 'tsoa';
import { AuthService } from './service';

@Route('')
export class AuthController extends Controller {
  @Get('oauthlogin')
  public async oauthLogin(): Promise<{ url: string }> {
    const url = await new AuthService().oauthLogin();
    return { url };
  }

	@Security('cookie')
	@Get('protected')
	public async protected(): Promise<{ message: string }> {
		return { message: 'ok' };
	}

	@Get('oauthlogin/callback')
	public async oauthLoginCallback(
		@Query('code') authCode?: string,
	): Promise<void> {
		if (!authCode) {
			this.setStatus(302);
			this.setHeader('Location', `${process.env.SHOPPER_FRONTEND_URL}/login`);
			return;
		}
		const authToken = await new AuthService().oauthLoginCallback(authCode);
		this.setHeader('Set-Cookie', `authToken=${authToken}; HttpOnly; Secure; Path=/shopper; SameSite=Lax; Max-Age=3600`);
		this.setStatus(302);
		this.setHeader('Location', process.env.SHOPPER_FRONTEND_URL as string);
	}
}
