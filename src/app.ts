import express from 'express';
import cors from 'cors';
import { errorMiddleware } from './middleware/error.middleware';
import { requestLogger } from './middleware/request-logger.middleware';
import routerApp from './modules/auth/auth.routes';
import routerServices from './modules/adding/adding.routes'
import sequelize from './db';

export const createApp = () => {
  const app = express();

  app.use(cors());
  app.use(express.json());
  app.use(requestLogger);

  app.use('/api', routerApp);
  app.use('/api', routerServices);

  app.get('/health', (_req, res) => {
    res.status(200).json({
      status: 'ok',
      service: 'SupplyChain Marketplace API',
    });
  });

  app.post('/reset', async (_req, res) => {
    await sequelize.query('TRUNCATE TABLE "users" RESTART IDENTITY CASCADE;');
    res.status(204).end();
  });

  app.use(errorMiddleware);

  return app;
};
