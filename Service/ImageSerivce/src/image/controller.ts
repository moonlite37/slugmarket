import {Controller, Post, Route, SuccessResponse, UploadedFile} from 'tsoa';
import type {File} from '@tsoa/runtime';

import type {ImageUploadResponse} from '.';
import {ImageService} from './service';

@Route('image')
export class ImageController extends Controller {
	@Post()
	@SuccessResponse('201', 'Created')
	public async upload(
		@UploadedFile('image') image: File,
	): Promise<ImageUploadResponse> {
		this.setStatus(201);
		return await new ImageService().upload(image);
	}
}
