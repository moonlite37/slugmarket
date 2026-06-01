export interface SessionUser {
  id: string
  email?: string
}

declare global {
  namespace Express {
    export interface Request {
      user?: SessionUser
    }
  }
}
