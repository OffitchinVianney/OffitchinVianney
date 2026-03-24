import express from 'express';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import { securityMiddlewares } from './middlewares/security.js';
import { errorHandler, notFoundHandler } from './middlewares/errorHandler.js';
import authRoutes from './routes/authRoutes.js';
import profileRoutes from './routes/profileRoutes.js';
import healthRoutes from './routes/healthRoutes.js';
import { logEvent } from './utils/logger.js';

const app = express();

app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(
  morgan('combined', {
    stream: {
      write: (message) => logEvent('info', message.trim())
    }
  })
);

securityMiddlewares.forEach((mw) => app.use(mw));

app.use('/api/health', healthRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/profile', profileRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

export default app;
