import { Response, NextFunction } from 'express';
import { Op } from 'sequelize';
import { AuthRequest } from '../types';
import { Store } from '../models/Store';
import { User } from '../models/User';
import { Rating } from '../models/Rating';
import sequelize from '../config/db';
import { successResponse, errorResponse } from '../utils/response.util';

const getSortField = (sortBy: unknown): string => {
  return sortBy === 'name' || sortBy === 'email' || sortBy === 'address'
    ? sortBy
    : 'createdAt';
};

const getSortDirection = (sortOrder: unknown): 'ASC' | 'DESC' => {
  return sortOrder === 'asc' ? 'ASC' : 'DESC';
};

const getAverageRating = async (storeId: number): Promise<number> => {
  const avg = await Rating.findOne({
    where: { storeId },
    attributes: [[sequelize.fn('AVG', sequelize.col('value')), 'avg']],
    raw: true,
  });
  const averageRating = Number((avg as { avg?: string | number } | null)?.avg ?? 0);
  return Math.round(averageRating * 10) / 10;
};

const buildStoreResponse = async (
  stores: Store[],
  userId?: number,
  userRole?: string
): Promise<Record<string, unknown>[]> => {
  return Promise.all(
    stores.map(async (store) => {
      const storeObj: Record<string, unknown> = {
        id: store.id,
        name: store.name,
        email: store.email,
        address: store.address,
        ownerId: store.ownerId,
        averageRating: await getAverageRating(store.id),
      };

      if (userRole === 'user' && userId) {
        const userRating = await Rating.findOne({
          where: { storeId: store.id, userId },
        });
        storeObj.userRating = userRating?.value ?? null;
      }

      return storeObj;
    })
  );
};

export const getStores = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { name, address, sortBy, sortOrder, page, limit } = req.query;

    const where: Record<string, unknown> = {};
    if (name) where.name = { [Op.iLike]: `%${name}%` };
    if (address) where.address = { [Op.iLike]: `%${address}%` };

    const sortField = getSortField(sortBy);
    const sortDirection = getSortDirection(sortOrder);

    if (page) {
      const pageNum = Math.max(1, parseInt(page as string, 10) || 1);
      const limitNum = Math.max(1, parseInt(limit as string, 10) || 20);
      const offset = (pageNum - 1) * limitNum;

      const { rows: stores, count: total } = await Store.findAndCountAll({
        where,
        order: [[sortField, sortDirection]],
        offset,
        limit: limitNum,
      });

      const storesData = await buildStoreResponse(stores, req.user?.id, req.user?.role);

      successResponse(
        res,
        {
          stores: storesData,
          pagination: {
            page: pageNum,
            limit: limitNum,
            total,
            totalPages: Math.ceil(total / limitNum),
          },
        },
        'Stores retrieved successfully.'
      );
    } else {
      const stores = await Store.findAll({
        where,
        order: [[sortField, sortDirection]],
      });

      const storesData = await buildStoreResponse(stores, req.user?.id, req.user?.role);

      successResponse(res, storesData, 'Stores retrieved successfully.');
    }
  } catch (error) {
    next(error);
  }
};

export const createStore = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { name, email, address, ownerId } = req.body;

    if (ownerId) {
      const owner = await User.findByPk(ownerId);
      if (!owner) {
        errorResponse(res, 'Owner not found.', 404);
        return;
      }
      if (owner.role !== 'store_owner') {
        errorResponse(res, 'Owner must have store_owner role.', 400);
        return;
      }
    }

    const existingStore = await Store.findOne({ where: { email } });
    if (existingStore) {
      errorResponse(res, 'Store email already registered.', 409);
      return;
    }

    const store = await Store.create({
      name,
      email,
      address,
      ownerId: ownerId || null,
    });

    successResponse(res, store, 'Store created successfully.', 201);
  } catch (error) {
    next(error);
  }
};
