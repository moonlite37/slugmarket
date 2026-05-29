import {PutObjectCommand, S3Client} from '@aws-sdk/client-s3';
import crypto from 'crypto';
import dotenv from 'dotenv';
import path from 'path';

import type {File} from '@tsoa/runtime';
import type {ImageUploadResponse} from '.';

dotenv.config({path: path.resolve(process.cwd(), '../../.env')});

const bucket = process.env.AWS_S3_BUCKET;
const region = process.env.AWS_REGION ?? process.env.AWS_DEFAULT_REGION;

if (!bucket) {
	throw new Error('Missing AWS_S3_BUCKET environment variable');
}

if (!region) {
	throw new Error('Missing AWS_REGION environment variable');
}

const s3 = new S3Client({region});

export class ImageService {
	public async upload(image: File): Promise<ImageUploadResponse> {
		const extension = path.extname(image.originalname).toLowerCase() || '.png';
		const key = `products/${crypto.randomUUID()}${extension}`;

		await s3.send(new PutObjectCommand({
			Bucket: bucket,
			Key: key,
			Body: image.buffer,
			ContentType: image.mimetype,
		}));

		return {
			url: `https://${bucket}.s3.${region}.amazonaws.com/${key}`,
		};
	}
}
