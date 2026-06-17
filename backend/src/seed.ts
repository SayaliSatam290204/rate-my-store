import dotenv from 'dotenv';
dotenv.config();

import sequelize from './config/db';
import { User } from './models/User';
import { Store } from './models/Store';
import { Rating } from './models/Rating';

const seed = async (): Promise<void> => {
  try {
    await sequelize.sync({ force: true });

    const admin = await User.create({
      name: 'System Administrator One',
      email: 'admin@ratemystore.com',
      password: 'Admin@123',
      role: 'admin',
      address: '123 Admin Street, System City, State 400001',
    });

    const storeOwner = await User.create({
      name: 'Premium Store Owner Account',
      email: 'owner@ratemystore.com',
      password: 'Owner@123',
      role: 'store_owner',
      address: '456 Owner Avenue, Business District, State 400002',
    });

    const user1 = await User.create({
      name: 'Regular Customer User One',
      email: 'user1@ratemystore.com',
      password: 'User1@123',
      role: 'user',
      address: '789 User Lane, Residential Area, State 400003',
    });

    const user2 = await User.create({
      name: 'Regular Customer User Two',
      email: 'user2@ratemystore.com',
      password: 'User2@123',
      role: 'user',
      address: '321 Customer Road, Suburb Area, State 400004',
    });

    const store1 = await Store.create({
      name: 'Premium Electronics And Gadgets Hub',
      email: 'electronics@store.com',
      address: 'Shop 1, Tech Plaza, MG Road, State 400005',
      ownerId: storeOwner.id,
    });

    const store2 = await Store.create({
      name: 'Fresh Organic Vegetables And Fruits',
      email: 'organic@store.com',
      address: 'Shop 2, Green Market, FC Road, State 400006',
      ownerId: null,
    });

    await Rating.create({ value: 4, userId: user1.id, storeId: store1.id });
    await Rating.create({ value: 5, userId: user2.id, storeId: store1.id });
    await Rating.create({ value: 3, userId: user1.id, storeId: store2.id });

    console.log('Seeded successfully.');
    console.log('Admin:', admin.email);
    console.log('Store Owner:', storeOwner.email);
    console.log('User 1:', user1.email);
    console.log('User 2:', user2.email);

    process.exit(0);
  } catch (error) {
    console.error('Seed error:', error);
    process.exit(1);
  }
};

seed();
