import dotenv from 'dotenv';
import * as path from 'path';
import { NewListing, UpdateListingBody } from '.';

dotenv.config({ path: path.resolve(process.cwd(), '../../../.env') });

const AUTH_MICROSERVICE = 'http://127.0.0.1:3010/api/v0';
const CORPORATE_MICROSERVICE = 'http://127.0.0.1:3040/api/v0';

export class CorpService {
	public async login(email: string, password: string): Promise<string | undefined> {
		const res = await fetch(`${AUTH_MICROSERVICE}/login`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ email, password }),
		});
		if (!res.ok) return undefined;
		const { authToken } = await res.json();
		const checkRes = await fetch(`${AUTH_MICROSERVICE}/check`, {
			headers: { Authorization: `Bearer ${authToken}` },
		});
		if (!checkRes.ok) return undefined;
		const { roles } = await checkRes.json();
		if (!roles.includes('corporate')) return undefined;
		return authToken;
	}

	public async createAPIKey(authToken: string): Promise<string | null> {
		const res = await fetch(`${CORPORATE_MICROSERVICE}/generate`, {
			method: 'POST',
			headers: { Authorization: `Bearer ${authToken}` },
		});
		if (res.status === 401) return null;
		if (!res.ok) throw new Error(`Request failed with status ${res.status}`);
		return res.text();
	}

	public async getListing(apiKey: string | undefined) {
		const res = await fetch(`${CORPORATE_MICROSERVICE}/listing`, {
			headers: { Authorization: apiKey ?? '' },
		});
		if (res.status === 401) return undefined;
		if (!res.ok) throw new Error('Failed to fetch listings');
		return res.json();
	}

	public async createListing(apiKey: string | undefined, body: NewListing) {
		const res = await fetch(`${CORPORATE_MICROSERVICE}/listing`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				Authorization: apiKey ?? '',
			},
			body: JSON.stringify(body),
		});
		if (res.status === 401) return undefined;
		if (!res.ok) throw new Error('Failed to create listing');
		return res.json();
	}

	public async updateListing(apiKey: string | undefined, id: string, body: UpdateListingBody) {
		const res = await fetch(`${CORPORATE_MICROSERVICE}/listing/${id}`, {
			method: 'PUT',
			headers: {
				'Content-Type': 'application/json',
				Authorization: apiKey ?? '',
			},
			body: JSON.stringify(body),
		});
		if (res.status === 401) return null;
		if (res.status === 404) return undefined;
		if (!res.ok) throw new Error('Failed to update listing');
		return res.json();
	}

	public async deleteListing(apiKey: string | undefined, id: string): Promise<boolean> {
		const res = await fetch(`${CORPORATE_MICROSERVICE}/listing/${id}`, {
			method: 'DELETE',
			headers: { Authorization: apiKey ?? '' },
		});
		if (res.status === 401) throw new Error('Unauthorized');
		if (res.status === 404) return false;
		return true;
	}

	public async getOrders(apiKey: string | undefined) {
		const res = await fetch(`${CORPORATE_MICROSERVICE}/order`, {
			headers: { Authorization: apiKey ?? '' },
		});
		if (res.status === 401) return undefined;
		if (!res.ok) throw new Error('Failed to fetch orders');
		return res.json();
	}

	public async updateOrderStatus(apiKey: string | undefined, id: string, status: string) {
		const res = await fetch(`${CORPORATE_MICROSERVICE}/order/${id}`, {
			method: 'PUT',
			headers: {
				'Content-Type': 'application/json',
				Authorization: apiKey ?? '',
			},
			body: JSON.stringify({ status }),
		});
		if (res.status === 401) return undefined;
		if (!res.ok) throw new Error('Failed to update order');
		return res.json();
	}
}
