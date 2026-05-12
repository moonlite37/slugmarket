import dotenv from 'dotenv'
import * as path from 'path'

dotenv.config({ path: path.resolve(process.cwd(), '../../../.env') })

import supertest from 'supertest';
import app from '../src/app';

export const request = supertest(app);
