import {beforeEach, describe, expect, it, vi} from 'vitest';
import {request} from './setup';

const {putObjectInputs, sendMock} = vi.hoisted(() => {
	process.env.AWS_S3_BUCKET = 'slug-market-product-images';
	process.env.AWS_REGION = 'us-west-1';

	return {
		putObjectInputs: [] as unknown[],
		sendMock: vi.fn<(_: unknown) => Promise<object>>().mockResolvedValue({}),
	};
});

vi.mock('@aws-sdk/client-s3', () => {
	class PutObjectCommand {
		public input: unknown;

		public constructor(input: unknown) {
			this.input = input;
			putObjectInputs.push(input);
		}
	}

	class S3Client {
		public async send(command: unknown): Promise<unknown> {
			return sendMock(command);
		}
	}

	return {PutObjectCommand, S3Client};
});

const image = Buffer.from(
	'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+/p9sAAAAASUVORK5CYII=',
	'base64',
);

const uploadImage = () => request
	.post('/api/v0/image')
	.attach('image', image, {
		filename: 'test-image.png',
		contentType: 'image/png',
	});

const uploadImageWithoutExtension = () => request
	.post('/api/v0/image')
	.attach('image', image, {
		filename: 'test-image',
		contentType: 'image/png',
	});

describe('POST /api/v0/image', () => {
	beforeEach(() => {
		putObjectInputs.length = 0;
		sendMock.mockClear();
	});

	it('returns created status', async () => {
		const res = await uploadImage();

		expect(res.status).toBe(201);
	});

	it('returns s3 image link', async () => {
		const res = await uploadImage();

		expect(res.body).toEqual({
			url: expect.stringMatching(
				/^https:\/\/.+\.s3\.[a-z0-9-]+\.amazonaws\.com\/.+\.png$/,
			),
		});
	});

	it('uploads image to s3', async () => {
		await uploadImage();

		expect(sendMock).toHaveBeenCalledOnce();
		expect(putObjectInputs).toHaveLength(1);
		expect(putObjectInputs[0]).toMatchObject({
			Bucket: 'slug-market-product-images',
			Key: expect.stringMatching(/^products\/.+\.png$/),
			Body: expect.any(Buffer),
			ContentType: 'image/png',
		});
	});

	it('uses png extension when filename has no extension', async () => {
		await uploadImageWithoutExtension();

		expect(putObjectInputs[0]).toMatchObject({
			Key: expect.stringMatching(/^products\/.+\.png$/),
		});
	});
});

describe('docs', () => {
	it('GET /api/v0/docs/', async () => {
		await request.get('/api/v0/docs/').expect(200);
	});
});
