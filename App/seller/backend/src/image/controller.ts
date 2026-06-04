import { Controller, Post, Route, Security, SuccessResponse, UploadedFile } from 'tsoa';
import type { File } from '@tsoa/runtime';
import { ImageUploadResponse } from '.';
import { ImageService } from './service';

@Route('image')
export class ImageController extends Controller {
	@Post('')
	@Security('cookie')
	@SuccessResponse('201', 'Created')
	public async upload(
		@UploadedFile('image') image: File,
	): Promise<ImageUploadResponse> {
		this.setStatus(201);
		return new ImageService().upload(image);
	}
}
