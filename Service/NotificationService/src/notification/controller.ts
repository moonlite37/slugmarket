import {
	Route,
	Controller,
	Post,
	Body,
	Response,
	SuccessResponse,
} from 'tsoa';
import { SendEmailRequest, SendEmailResponse, SendTextRequest, SendTextResponse } from '.';
import { NotificationService } from './service';

@Route('')
export class NotificationController extends Controller {
	@Post('email')
	@SuccessResponse('200', 'Sent')
	@Response('500', 'Internal Server Error')
	public async sendEmail(
		@Body() body: SendEmailRequest,
	): Promise<SendEmailResponse> {
		const result = await new NotificationService().sendEmail(body);
		if (!result.success) {
			this.setStatus(500);
		}
		return result;
	}

	@Post('text')
	@SuccessResponse('200', 'Sent')
	@Response('500', 'Internal Server Error')
	public async sendText(
		@Body() body: SendTextRequest,
	): Promise<SendTextResponse> {
		const result = await new NotificationService().sendText(body);
		if (!result.success) {
			this.setStatus(500);
		}
		return result;
	}
}
