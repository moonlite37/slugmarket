import { EncryptJWT, jwtDecrypt } from 'jose';
import dotenv from 'dotenv';
import * as path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '../../.env') });

import { Credentials, Authenticated, SessionUser } from '.';
import { pool } from '../db';
import { OAuth2Client } from 'google-auth-library';

interface UserRow {
  id: string;
  name: string;
  roles: string[];
}

const TEXT_ENCODED_SECRET = new TextEncoder().encode(process.env.SECRET);
const JWE_ALGORITHM = 'A256CBC-HS512';

export const encryptJwe = async (id: string, roles: string[], email?: string, name?: string): Promise<string> => {
	return await new EncryptJWT({ id, roles, email, name })
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
				SELECT id, data->>'name' AS name, ARRAY(SELECT jsonb_array_elements_text(data->'roles')) AS roles
				FROM "user"
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
			authToken: await encryptJwe(result[0].id, result[0].roles, credentials.email, result[0].name),
		};
	}

	public async oauthLogin(app: 'seller' | 'shopper'): Promise<string> {
		const redirectUri = app === 'shopper'
			? process.env.GOOGLE_REDIRECT_URL_SHOPPER
			: process.env.GOOGLE_REDIRECT_URL_SELLER;
		return this.oAuth2Client.generateAuthUrl({
			scope: ['openid', 'email', 'profile'],
			redirect_uri: redirectUri,
		});
	}

	public async oauthLoginCallback(authCode: string, app: 'seller' | 'shopper'): Promise<Authenticated> {
		const redirectUri = app === 'shopper'
			? process.env.GOOGLE_REDIRECT_URL_SHOPPER
			: process.env.GOOGLE_REDIRECT_URL_SELLER;
		const { tokens } = await this.oAuth2Client.getToken({ code: authCode, redirect_uri: redirectUri });

		const ticket = await this.oAuth2Client.verifyIdToken({
			idToken: tokens.id_token as string,
			audience: process.env.GOOGLE_CLIENT_ID,
		});

		const payload = ticket.getPayload();
		const name = payload?.name;
		const email = payload?.email;
		const sub = payload?.sub;

		const query = `
			INSERT INTO "user" (data)
				VALUES (
					jsonb_build_object(
						'name', $1::text,
						'email', $2::text,
						'sub', $3::text,
						'roles', COALESCE($4::jsonb, '[]'::jsonb)
					)
				)

				ON CONFLICT ((data->>'sub')) DO UPDATE
				SET data = jsonb_set(
					"user".data,
					'{roles}',
					(
						SELECT jsonb_agg(DISTINCT role)
						FROM (
							SELECT jsonb_array_elements(
								COALESCE("user".data->'roles', '[]'::jsonb)
							) AS role
							UNION
							SELECT jsonb_array_elements(
								COALESCE(EXCLUDED.data->'roles', '[]'::jsonb)
							) AS role
						) r
					)
				)
				RETURNING
					id,
					data->>'name' AS name,
					data->'roles' AS roles;
		`;

		const result = await pool.query<UserRow>(query, [
			name,
			email,
			sub,
			JSON.stringify([app]),
		]);
		
		return {
			name: result.rows[0].name,
			authToken: await encryptJwe(result.rows[0].id, result.rows[0].roles, email as string, name as string),
		};
	}
	public async check(authHeader?: string, scopes?: string[] | []): Promise<SessionUser> {
		if (!authHeader) {
			throw new Error('Unauthorized');
		}
		const token = authHeader.split(' ')[1];
		const { payload } = await jwtDecrypt(token, TEXT_ENCODED_SECRET, {
			contentEncryptionAlgorithms: [JWE_ALGORITHM],
		});
		const roles = payload.roles as string[];
		for(const perm of scopes ?? []){
			if(!roles.includes(perm)){
				throw new Error('Unauthorized');
			}
		}
		return {
			id: payload.id as string,
			email: payload.email as string,
			name: payload.name as string,
			roles,
		};
	}
}
