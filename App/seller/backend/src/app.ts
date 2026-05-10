import express, {
  Express,
  Router,
  Response as ExResponse,
  Request as ExRequest,
  // ErrorRequestHandler,
  // NextFunction,
} from 'express';
import cors from 'cors';
import swaggerUi from 'swagger-ui-express';
import cookieParser from 'cookie-parser';

import { RegisterRoutes } from '../build/routes';

const app: Express = express();
app.use(cors({ origin: 'http://localhost:5173' }));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(
  '/api/v0/docs',
  swaggerUi.serve,
  async (_req: ExRequest, res: ExResponse) => {
    res.send(swaggerUi.generateHTML(await import('../build/swagger.json')));
  },
);

const router = Router();
RegisterRoutes(router);
app.use('/api/v0', router);

// const errorHandler: ErrorRequestHandler = (
//   err,
//   _req,
//   res,
//   _next: NextFunction,
// ) => {
//   res.status(err.status).json({
//     message: err.message,
//     errors: err.errors,
//     status: err.status,
//   });
//   console.log('code:', _req.query.code);
//   console.log('error:', _req.query.error);
//   _next();
// };
// app.use(errorHandler);

export default app;
