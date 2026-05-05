import { Credentials, Authenticated} from '.';
import {pool} from '../db';

interface UserRow {
	name: string
}

export class AuthService {
	public async login(credentials: Credentials): Promise<Authenticated | undefined> {
		const query = `
			SELECT data->>'name' AS name
			FROM users
			WHERE data->>'email' = $1
			AND data->>'password' = crypt($2, data->>'password')
		`;
		const result = await pool.query<UserRow>(query, [
			credentials.email,
			credentials.password,
		]);

		if (result.rows.length === 0) {
			return undefined;
		}

		return {name: result.rows[0].name, accessToken: 'authToken'};
	}
}
