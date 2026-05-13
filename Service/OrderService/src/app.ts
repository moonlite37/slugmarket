import 'reflect-metadata';
import express, { Express } from 'express';
import cors from 'cors';
import { buildSchema } from 'type-graphql';
import { createHandler } from 'graphql-http/lib/use/express';
import { OrderResolver } from './order/resolver';

let app: Express;

export async function createApp(): Promise<Express> {
  app = express();
  app.use(cors());
  app.use(express.json());

  const schema = await buildSchema({
    resolvers: [OrderResolver],
    validate: true,
  });

  app.all('/graphql', createHandler({ schema }));

  return app;
}

export { app };
