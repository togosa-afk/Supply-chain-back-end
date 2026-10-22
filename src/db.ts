import { Sequelize } from 'sequelize';
import { env } from './config/env';

const sequelize = new Sequelize(env.db.name, env.db.user, env.db.pass, {
  host: env.db.host,
  port: env.db.port,
  dialect: 'postgres',
  logging: false,
});

export const connectDB = async (): Promise<void> => {
  await sequelize.authenticate();
  await sequelize.sync();
  console.log('PostgreSQL connected and models synchronized successfully.');
};

export default sequelize;