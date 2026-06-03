import { Route, Controller, Post, Body, Response, Get, Query, Request } from 'tsoa';
import * as express from 'express';

import { Authenticated, SessionUser, Credentials} from '.';
import { AuthService } from './service';

@Route('')
export class AuthController extends Controller {
  @Post('login')
  @Response('401', 'Unauthorized')
	public async login(
    @Body() body: Credentials,
	): Promise<Authenticated | undefined> {
		const user = await new AuthService().login(body);
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
  @Get('check')
  @Response('401', 'Unauthorized')
  public async check(
	@Request() req: express.Request,
	@Query() scopes?: string[],
  ): Promise<SessionUser | undefined> {
  	try {
  		return await new AuthService().check(req.headers.authorization, scopes);
  	} catch {
  		this.setStatus(401);
  		return undefined;
  	}
  }

  @Get('oauthlogin')
  public async oauthLogin(
    @Query('app') app: 'seller' | 'shopper',
    @Query('source') source?: string,
  ): Promise<void> {
  	const url = await new AuthService().oauthLogin(app, source);
  	this.setStatus(302);
  	this.setHeader('Location', url);
  }

  @Get('oauthlogin/callback')
  public async oauthLoginCallback(
    @Query('code') authCode: string,
    @Query('app') app: 'seller' | 'shopper',
  ): Promise<Authenticated | undefined> {
  	return await new AuthService().oauthLoginCallback(authCode, app);
  }
}
