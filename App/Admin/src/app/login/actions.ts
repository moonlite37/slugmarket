'use server';
import { Credentials, Authenticated } from '../../auth';
import { AuthService } from '../../auth/service';
export async function login(credentials: Credentials) : Promise<Authenticated|undefined> {
	try {
		const result = await new AuthService().login(credentials);
		console.log('LOGIN RESULT:', result);
		return result;
	}
	catch (e) {
		console.log('LOGIN ERROR:', e);
		return undefined;
	}
}
