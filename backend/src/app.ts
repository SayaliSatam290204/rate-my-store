import dotenv from 'dotenv';
dotenv.config();

import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import morgan from 'morgan';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';

import authRoutes from './routes/auth.routes';
import userRoutes from './routes/user.routes';
import storeRoutes from './routes/store.routes';
import ratingRoutes from './routes/rating.routes';
import dashboardRoutes from './routes/dashboard.routes';
import { errorResponse } from './utils/response.util';

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // elevated slightly to prevent test suites from hitting limits, yet secure for brute force
  message: { success: false, message: 'Too many attempts, please try again later.' },
  standardHeaders: true,
  legacyHeaders: false,
});

app.use('/api/auth', authLimiter, authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/stores', storeRoutes);
app.use('/api/ratings', ratingRoutes);
app.use('/api/dashboard', dashboardRoutes);

app.use((_req: Request, res: Response) => {
  errorResponse(res, 'Route not found.', 404);
});

app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  console.error(err.stack);
  errorResponse(res, 'Internal server error.', 500);
});

export default app;
