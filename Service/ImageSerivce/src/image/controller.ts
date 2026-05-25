import {Controller, Get, Route} from 'tsoa';

interface HealthResponse {
	status: string;
	service: string;
}

@Route('image')
export class ImageController extends Controller {
	@Get('health')
	public async health(): Promise<HealthResponse> {
		return {
			status: 'ok',
			service: 'ImageSerivce',
		};
	}
}
