import { Route, Controller, Post, Body, Response, Get, Query } from 'tsoa';

import { Credentials, Authenticated, AuthenticatedUser } from '.';
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
		this.setHeader(
			'Set-Cookie',
			`authToken=${user.authToken}; HttpOnly; Path=/; SameSite=Strict`,
		);
		
		return user;
	}

  @Get('oauthlogin')
  public async oauthLogin(): Promise<void> {
  	const url = await new AuthService().oauthLogin();
  	this.setStatus(302);
  	this.setHeader('Location', url);
  }

  @Get('oauthlogin/callback')
  public async oauthLoginCallback(
    @Query('code') authCode: string,
  ): Promise<AuthenticatedUser> {
  	return await new AuthService().oauthLoginCallback(authCode);
  }
}
