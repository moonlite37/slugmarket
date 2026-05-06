import {
	Route,
	Controller,
	Post,
	Body,
	Response,
} from 'tsoa';

import { Credentials, Authenticated} from '.';
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
}