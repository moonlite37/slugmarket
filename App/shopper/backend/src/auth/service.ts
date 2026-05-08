const AUTH_MICROSERVICE = 'http://localhost:3010/api/v0';

export class AuthService {
	public async oauthLogin(): Promise<string> {
		const res = await fetch(`${AUTH_MICROSERVICE}/oauthlogin?app=shopper`, { redirect: 'manual' });
		return res.headers.get('location') as string;
	}

	public async oauthLoginCallback(code: string): Promise<string> {
		const res = await fetch(`${AUTH_MICROSERVICE}/oauthlogin/callback?code=${code}&app=shopper`);
		const data = await res.json();
		return data.authToken;
	}
}
