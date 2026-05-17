import { Request } from 'express';

const AUTH_MICROSERVICE = 'http://127.0.0.1:3010/api/v0';

export interface SessionUser {
  id: string
  roles: string
}

export async function expressAuthentication(
	request: Request,
): Promise<SessionUser> {
	const header = request.headers.authorization;
	const res = await fetch(`${AUTH_MICROSERVICE}/check`, {
		headers: {
			authorization: header ?? '',
		},
	});
	if(res.status !== 200){
		throw new Error('Unauthorized');
	}
	const data = await res.json();
	const perms = data.roles;
	if(perms.includes('corporate')){
		return data;
	}
	throw new Error('Unauthorized');
	
}

