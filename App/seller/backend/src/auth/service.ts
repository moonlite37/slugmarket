import { OAuth2Client } from 'google-auth-library';

export class AuthService {
  private oAuth2Client: OAuth2Client;

  constructor() {
    this.oAuth2Client = new OAuth2Client({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      redirectUri: 'http://localhost:3010/api/v0/login/callback',
    });
  }

  public async login(): Promise<string> {
    return this.oAuth2Client.generateAuthUrl({
      scope: ['openid', 'email', 'profile'],
    });
  }

  public async loginCallback(authCode: string): Promise<void> {
    const { tokens } = await this.oAuth2Client.getToken(authCode);

    const ticket = await this.oAuth2Client.verifyIdToken({
      idToken: tokens.id_token as string,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const email = payload?.email;
    const name = payload?.name;
    console.log(email);
    console.log(name);
  }
}
