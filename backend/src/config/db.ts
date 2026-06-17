import 'reflect-metadata';
import { Sequelize } from 'sequelize-typescript';
import path from 'path';

const sequelize = new Sequelize({
  dialect: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT) || 5432,
  username: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'ratemystore',
  logging: process.env.NODE_ENV === 'development' ? console.log : false,
  models: [path.join(__dirname, '../models')],
});

export const connectDB = async (): Promise<void> => {
  try {
    await sequelize.authenticate();
    await sequelize.sync({ alter: true });
    console.log('PostgreSQL connected and synced successfully.');
  } catch (error) {
    console.error('PostgreSQL connection failed:', error);
    process.exit(1);
  }
};

export default sequelize;
