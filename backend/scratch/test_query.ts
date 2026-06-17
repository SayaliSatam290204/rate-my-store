import dotenv from 'dotenv';
dotenv.config();

import sequelize from '../src/config/db';
import { Rating } from '../src/models/Rating';
import { User } from '../src/models/User';
import { Store } from '../src/models/Store';

const run = async () => {
  try {
    await sequelize.authenticate();
    console.log('DB connected.');

    const store = await Store.findOne({ where: { email: 'electronics@store.com' } });
    if (!store) {
      console.log('Store not found.');
      process.exit(1);
    }

    const sortDirection = 'ASC';
    const order = [['user', 'name', sortDirection]];

    console.log('Executing query...');
    const ratings = await Rating.findAll({
      where: { storeId: store.id },
      include: [{ model: User, as: 'user', attributes: ['name', 'email'] }],
      order: order as any,
    });

    console.log('Query succeeded, count:', ratings.length);
    process.exit(0);
  } catch (error) {
    console.error('QUERY FAILED WITH ERROR:', error);
    process.exit(1);
  }
};

run();
