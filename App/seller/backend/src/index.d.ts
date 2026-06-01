export interface SessionUser {
  id: string
  name?: string
}

declare global {
  namespace Express {
    export interface Request {
      user?: SessionUser
    }
  }
}
