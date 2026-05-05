import { Credentials, Authenticated} from ".";

export class AuthService {
    public async login(credentials: Credentials): Promise<Authenticated> {
        return {name: credentials.email, accessToken: 'authToken'}
    }
}
