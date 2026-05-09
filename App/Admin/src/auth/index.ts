export interface SessionUser {
  id: string
}

export interface Credentials {
  email: string,
  password: string
}

export interface Authenticated {
  name: string,
  authToken: string
}
