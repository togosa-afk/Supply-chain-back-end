import express from 'express';
import cors from 'cors';
import { errorMiddleware } from './middleware/error.middleware';
import routerApp from './modules/auth/auth.routes';
import sequelize from './db';

export const createApp = () => {
  const app = express();

  app.use(cors());
  app.use(express.json());

  app.use('/api', routerApp);

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
