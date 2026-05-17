import {
	Route,
	Controller,
	Post,
	Security,
	Response,
	Request,
} from 'tsoa';
import { Request as ExpressRequest } from 'express';
import { api_key } from '.';
import { ApiService } from './service';

@Route('')
@Security('jwt', ['corporate'])
export class CorporateController extends Controller {
	@Post('generate')
	@Response('201', 'Created')
	public async createAPIKey(@Request() request: ExpressRequest,
	): Promise<api_key> {
		const currentId = request.user.id;
		const res = await new ApiService().createAPIKey(currentId);
		this.setStatus(201);
		return res;
	}
}
