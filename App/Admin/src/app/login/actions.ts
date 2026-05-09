'use server';

import { Credentials, Authenticated } from '../../auth';
import { AuthService } from '../../auth/service';

export async function login(credentials: Credentials) : Promise<Authenticated|undefined> {
	try {
		return await new AuthService().login(credentials);
	}
	catch {
		return undefined;
	}
}