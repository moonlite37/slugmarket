export interface Credentials {
  email: string,
  password: string
}

export interface Authenticated {
  name: string,
  authToken: string
}

export interface SessionUser {
  id: string
  role: string
}