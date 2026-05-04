import { Request, Response } from 'express';

export async function auth(_req: Request, res: Response) {
  res.status(200).json([]);
}
