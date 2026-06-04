import type { File } from '@tsoa/runtime';
import { ImageUploadResponse } from '.';

const IMAGE_MICROSERVICE = 'http://127.0.0.1:3018/api/v0';

export class ImageService {
	public async upload(image: File): Promise<ImageUploadResponse> {
		const formData = new FormData();
		formData.append('image', new Blob([image.buffer], { type: image.mimetype }), image.originalname);
		const res = await fetch(`${IMAGE_MICROSERVICE}/image`, {
			method: 'POST',
			body: formData,
		});
		if (res.status !== 201) {
			throw new Error('Failed to upload image');
		}
		return res.json();
	}
}
