import express, {
  Express,
  NextFunction,
  ErrorRequestHandler,
} from 'express';
import cors from 'cors';

import { auth } from './auth/controller';

const app: Express = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.get('/api/auth', auth);

const errorHandler: ErrorRequestHandler = (
  err,
  _req,
  res,
  _next: NextFunction,
) => {
  res.status(err.status).json({
    message: err.message,
    errors: err.errors,
    status: err.status,
  });
  _next();
};
app.use(errorHandler);

export default app;
