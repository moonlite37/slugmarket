export interface Credentials {
  email: string,
  password: string
}

export interface Authenticated {
  name: string
}

export interface AuthenticatedUser extends Authenticated {
  authToken: string
}