import { Credentials, Authenticated } from '.';
import { pool } from '../db';
import { OAuth2Client } from 'google-auth-library';
import { EncryptJWT } from 'jose';

const TEXT_ENCODED_SECRET = new TextEncoder().encode(process.env.SECRET);
const JWE_ALGORITHM = 'A256CBC-HS512';

interface UserRow {
  name: string;
}

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

    return { name: result.rows[0].name, accessToken: 'authToken' };
  }

  public async oauthLogin(): Promise<string> {
    return this.oAuth2Client.generateAuthUrl({
      scope: ['openid', 'email', 'profile'],
    });
  }

  public async oauthLoginCallback(authCode: string): Promise<string> {
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
			VALUES (jsonb_build_object('name', $1, 'email', $2, 'sub', $3))
			ON CONFLICT ((data->>'sub')) DO UPDATE
				SET data = EXCLUDED.data
			RETURNING data->>'name' AS name;
		`;

    const result = await pool.query<UserRow>(query, [name, email, sub]);

    return await new EncryptJWT({ name: result.rows[0].name })
      .setProtectedHeader({ alg: 'dir', enc: JWE_ALGORITHM })
      .setIssuedAt()
      .setExpirationTime('2h')
      .encrypt(TEXT_ENCODED_SECRET);
  }
}
