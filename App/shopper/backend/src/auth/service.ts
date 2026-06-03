import { SessionUser } from "..";

const AUTH_MICROSERVICE = 'http://127.0.0.1:3010/api/v0';

export class AuthService {
	public async oauthLogin(source?: string): Promise<string> {
		const params = new URLSearchParams({ app: 'shopper' });
		if (source) {
			params.set('source', source);
		}
		const res = await fetch(`${AUTH_MICROSERVICE}/oauthlogin?${params.toString()}`, { redirect: 'manual' });
		return res.headers.get('location') as string;
	}

	public async oauthLoginCallback(code: string): Promise<string> {
		const res = await fetch(`${AUTH_MICROSERVICE}/oauthlogin/callback?code=${code}&app=shopper`);
		const data = await res.json();
		return data.authToken;
	}

	public async check(authToken: string): Promise<SessionUser> {
		const res = await fetch(`${AUTH_MICROSERVICE}/check`, {
			headers: { Authorization: `Bearer ${authToken}` }
		});
		if (!res.ok) throw new Error('Unauthorized');
		const { id, roles, email, name } = await res.json();
		if (!roles.includes('shopper')) throw new Error('Unauthorized');
		return { id, email, name };
	}
}
