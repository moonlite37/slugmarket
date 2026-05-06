import { EncryptJWT } from 'jose';
import dotenv from 'dotenv';
import * as path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

import { Credentials, Authenticated } from '.';
import { pool } from '../db';
import { OAuth2Client } from 'google-auth-library';

interface UserRow {
  id: string;
  name: string;
}

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
	private oAuth2Client: OAuth2Client;

	constructor() {
		this.oAuth2Client = new OAuth2Client({
			clientId: process.env.GOOGLE_CLIENT_ID,
			clientSecret: process.env.GOOGLE_CLIENT_SECRET,
			redirectUri: process.env.GOOGLE_REDIRECT_URL,
		});
	}

	public async login(
		credentials: Credentials,
	): Promise<Authenticated | undefined> {
		const { rows: result } = await pool.query<UserRow>({
			text: `
				SELECT id, data->>'name' AS name
				FROM users
				WHERE data->>'email' = $1
				AND data->>'password' = crypt($2, data->>'password')
			`,
			values: [credentials.email, credentials.password],
		});
		if (result.length === 0) {
			return undefined;
		}
		return {
			name: result[0].name,
			authToken: await encryptJwe(result[0].id),
		};
	}

	public async oauthLogin(): Promise<string> {
		return this.oAuth2Client.generateAuthUrl({
			scope: ['openid', 'email', 'profile'],
		});
	}

	public async oauthLoginCallback(authCode: string): Promise<Authenticated> {
		const { tokens } = await this.oAuth2Client.getToken(authCode);

		const ticket = await this.oAuth2Client.verifyIdToken({
			idToken: tokens.id_token as string,
			audience: process.env.GOOGLE_CLIENT_ID,
		});

		const payload = ticket.getPayload();
		const name = payload?.name;
		const email = payload?.email;
		const sub = payload?.sub;

		const query = `
			INSERT INTO users (data)
			VALUES (jsonb_build_object('name', $1::text, 'email', $2::text, 'sub', $3::text))
			ON CONFLICT ((data->>'sub')) DO UPDATE
				SET data = EXCLUDED.data
			RETURNING id, data->>'name' AS name;
		`;

		const result = await pool.query<UserRow>(query, [name, email, sub]);
		return {
			name: result.rows[0].name,
			authToken: await encryptJwe(result.rows[0].id),
		};
	}
}
