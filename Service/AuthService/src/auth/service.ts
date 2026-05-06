import { EncryptJWT } from 'jose';
import dotenv from 'dotenv';
import * as path from 'path';

dotenv.config({path: path.resolve(__dirname, '../../.env')});


import { Credentials, AuthenticatedUser} from '.';
import {pool} from '../db';

interface UserRow {
	id: string,
	name: string
}

console.log(process.env.SECRET);

const TEXT_ENCODED_SECRET = new TextEncoder().encode(process.env.SECRET);
const JWE_ALGORITHM = 'A256CBC-HS512';

export const encryptJwe = async (id: string): Promise<string> => {
	return await new EncryptJWT({ id })
		.setProtectedHeader({ alg: 'dir', enc: JWE_ALGORITHM })
		.setIssuedAt()
		.setExpirationTime('2h')
		.encrypt(TEXT_ENCODED_SECRET);
};


export class AuthService {
	public async login(credentials: Credentials): Promise<AuthenticatedUser | undefined> {
		const { rows: result }= await pool.query<UserRow>({
			text: `
				SELECT id, data->>'name' AS name
				FROM users
				WHERE data->>'email' = $1
				AND data->>'password' = crypt($2, data->>'password')
			`,
			values: [
				credentials.email,
				credentials.password,
			],
		});
		if (result.length === 0) {
			return undefined;
		}
		return {
			name: result[0].name,
			authToken: await encryptJwe(result[0].id),
		};
	}
}
