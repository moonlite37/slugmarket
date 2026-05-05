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
		return await new AuthService().login(credentials);
	}
}