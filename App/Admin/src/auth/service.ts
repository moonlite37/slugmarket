import { Credentials, Authenticated, SessionUser } from '.';

export class AuthService {
	public async login(credentials: Credentials): Promise<Authenticated> {
		return new Promise((resolve, reject) => {
			fetch('http://localhost:3010/api/v0/login', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					email: credentials.email,
					password: credentials.password,
				}),
			})
				.then((res) => {
					if (res.status !== 200) {
						reject('Unauthorized');
					}
					return res.json();
				})
				.then((data) => resolve(data))
				.catch((error) => reject(error));
		});
	}

	public async check(): Promise<SessionUser> {
		throw new Error('Not Implemented Yet');
	}
}