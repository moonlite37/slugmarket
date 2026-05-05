import { OAuth2Client } from 'google-auth-library';
import { EncryptJWT } from 'jose';

const TEXT_ENCODED_SECRET = new TextEncoder().encode(process.env.SECRET);
const JWE_ALGORITHM = 'A256CBC-HS512';

export class AuthService {
  private oAuth2Client: OAuth2Client;

  constructor() {
    this.oAuth2Client = new OAuth2Client({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      redirectUri: process.env.GOOGLE_REDIRECT_URL,
    });
  }

  public async login(): Promise<string> {
    return this.oAuth2Client.generateAuthUrl({
      scope: ['openid', 'email', 'profile'],
    });
  }

  public async loginCallback(authCode: string): Promise<string> {
    const { tokens } = await this.oAuth2Client.getToken(authCode);

    const ticket = await this.oAuth2Client.verifyIdToken({
      idToken: tokens.id_token as string,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    // const email = payload?.email;
    const name = payload?.name;

    return await new EncryptJWT({ name: name })
      .setProtectedHeader({ alg: 'dir', enc: JWE_ALGORITHM })
      .setIssuedAt()
      .setExpirationTime('2h')
      .encrypt(TEXT_ENCODED_SECRET);
  }
}
