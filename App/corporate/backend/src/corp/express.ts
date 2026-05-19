import { Request } from 'express';
import { SessionUser } from '.';

const AUTH_MICROSERVICE = 'http://127.0.0.1:3010/api/v0';

export async function expressAuthentication(
	request: Request,
	securityName: string,
	scopes?: string[],
): Promise<SessionUser> {
	console.log(securityName, scopes);
	const authHeader = request.headers.authorization;
	const authToken = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : undefined;
	if (!authToken) {
		throw new Error('No AuthToken');
	}
	const res = await fetch(`${AUTH_MICROSERVICE}/check`, {
		headers: { Authorization: `Bearer ${authToken}` },
	});
	if (!res.ok) {
		throw new Error('Unauthorized');
	}
	const { id, roles } = await res.json();
	if (!roles.includes('corporate')) {
		throw new Error('Unauthorized');
	}
	request.user = { id };
	return { id };
}
