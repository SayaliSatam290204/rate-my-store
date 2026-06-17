import { Response, NextFunction } from 'express';
import { AuthRequest } from '../types';
import { Rating } from '../models/Rating';
import { Store } from '../models/Store';
import { User } from '../models/User';
import sequelize from '../config/db';
import { successResponse, errorResponse } from '../utils/response.util';

const getSortDirection = (sortOrder: unknown): 'ASC' | 'DESC' => {
  return sortOrder === 'asc' ? 'ASC' : 'DESC';
};

export const submitRating = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { storeId, value } = req.body;

    if (!req.user) {
      errorResponse(res, 'Authentication required.', 401);
      return;
    }

    const store = await Store.findByPk(storeId);
    if (!store) {
      errorResponse(res, 'Store not found.', 404);
      return;
    }

    const [rating, created] = await Rating.findOrCreate({
      where: { userId: req.user.id, storeId },
      defaults: { value, userId: req.user.id, storeId },
    });

    if (!created) {
      rating.value = value;
      await rating.save();
    }

    successResponse(res, rating, 'Rating submitted successfully.');
  } catch (error) {
    next(error);
  }
};

export const getMyStoreRatings = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const store = await Store.findOne({ where: { ownerId: req.user?.id } });
    if (!store) {
      errorResponse(res, 'No store found for this owner.', 404);
      return;
    }

    const { sortBy, sortOrder } = req.query;
    const sortDirection = getSortDirection(sortOrder);
    const order =
      sortBy === 'name'
        ? [['user', 'name', sortDirection] as [string, string, 'ASC' | 'DESC']]
        : sortBy === 'rating'
          ? [['value', sortDirection] as [string, 'ASC' | 'DESC']]
          : [['createdAt', 'DESC'] as [string, 'DESC']];

    const ratings = await Rating.findAll({
      where: { storeId: store.id },
      include: [{ model: User, attributes: ['name', 'email'] }],
      order,
    });

    const avgResult = await Rating.findOne({
      where: { storeId: store.id },
      attributes: [[sequelize.fn('AVG', sequelize.col('value')), 'averageRating']],
      raw: true,
    });

    const averageRatingValue = Number(
      (avgResult as { averageRating?: string | number } | null)?.averageRating ?? 0
    );
    const averageRating = Math.round(averageRatingValue * 10) / 10;
    const totalRatings = await Rating.count({ where: { storeId: store.id } });
    const raters = ratings.map((rating) => ({
      name: rating.user.name,
      email: rating.user.email,
      rating: rating.value,
      submittedAt: rating.createdAt,
    }));

    successResponse(
      res,
      { averageRating, totalRatings, raters },
      'Store ratings retrieved successfully.'
    );
  } catch (error) {
    next(error);
  }
};
