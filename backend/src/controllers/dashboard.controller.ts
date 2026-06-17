import { Response, NextFunction } from 'express';
import { User } from '../models/User';
import { Store } from '../models/Store';
import { Rating } from '../models/Rating';
import { successResponse } from '../utils/response.util';

export const getStats = async (
  _req: unknown,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const [totalUsers, totalStores, totalRatings] = await Promise.all([
      User.count(),
      Store.count(),
      Rating.count(),
    ]);

    successResponse(
      res,
      { totalUsers, totalStores, totalRatings },
      'Dashboard stats retrieved successfully.'
    );
  } catch (error) {
    next(error);
  }
};
