import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import rateLimit from 'express-rate-limit';
import { env, isProduction } from './config/env.js';
import { apiRouter, API_PREFIX } from './routes/index.js';
import { notFoundHandler, errorHandler } from './middleware/errorHandler.js';

const app = express();

app.set('trust proxy', 1);

app.use(
  helmet({
    crossOriginResourcePolicy: { policy: 'cross-origin' },
  }),
);

const devOrigins = ['http://localhost:5173', 'http://localhost:5174', env.CLIENT_URL];

app.use(
  cors({
    origin: isProduction ? env.CLIENT_URL : devOrigins,
    credentials: true,
  }),
);

app.use(morgan(isProduction ? 'combined' : 'dev'));

app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true, limit: '1mb' }));
app.use(cookieParser());

const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 300,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many requests. Please try again later.',
  },
});

app.use(globalLimiter);

app.use(API_PREFIX, apiRouter);

app.use(notFoundHandler);
app.use(errorHandler);

export default app;
