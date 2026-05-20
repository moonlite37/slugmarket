import {Controller, Get, Route} from 'tsoa';

@Route('payment')
export class PaymentController extends Controller {
	@Get('health')
	public async health(): Promise<{status: string}> {
		return {status: 'ok'};
	}
}
