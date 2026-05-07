const AUTH_MICROSERVICE = 'http://localhost:3010/api/v0';

export class AuthService {
	public async oauthLogin(): Promise<string> {
		const res = await fetch(`${AUTH_MICROSERVICE}/oauthlogin`, { redirect: 'manual' });
		return res.headers.get('location') as string;
	}
}
