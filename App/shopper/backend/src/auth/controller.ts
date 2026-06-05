import { Route, Controller, Get, Delete, Query, Security } from 'tsoa';
import { AuthService } from './service';

const SOURCE_REDIRECTS: Record<string, string> = {
	cart: '/cart',
};

@Route('')
export class AuthController extends Controller {
  @Get('oauthlogin')
  public async oauthLogin(
		@Query('source') source?: string,
	): Promise<{ url: string }> {
    const url = await new AuthService().oauthLogin(source);
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
		@Query('state') state?: string,
	): Promise<void> {
		if (!authCode) {
			this.setStatus(302);
			this.setHeader('Location', `${process.env.SHOPPER_FRONTEND_URL}/login`);
			return;
		}
		const authToken = await new AuthService().oauthLoginCallback(authCode);
		this.setHeader('Set-Cookie', `authToken=${authToken}; HttpOnly; Secure; Path=/shopper; SameSite=Lax; Max-Age=3600`);
		this.setStatus(302);
		const redirectPath = state ? SOURCE_REDIRECTS[state] : undefined;
		this.setHeader('Location', `${process.env.SHOPPER_FRONTEND_URL}${redirectPath ?? ''}`);
	}

	@Delete('logout')
	public async logout(): Promise<void> {
		this.setHeader('Set-Cookie', 'authToken=; HttpOnly; Secure; Path=/shopper; SameSite=Lax; Max-Age=0');
	}
}
