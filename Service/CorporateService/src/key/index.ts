export type api_key = string

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

declare module 'express-serve-static-core' {
  interface Request {
    user: SessionUser;
  }
}
export {};