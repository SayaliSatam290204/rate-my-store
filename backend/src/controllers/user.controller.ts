import { Response, NextFunction } from 'express';
import { Op } from 'sequelize';
import { AuthRequest } from '../types';
import { User } from '../models/User';
import { Store } from '../models/Store';
import { Rating } from '../models/Rating';
import sequelize from '../config/db';
import { successResponse, errorResponse } from '../utils/response.util';

const excludePassword = (user: User): Record<string, unknown> => {
  const userObj = user.toJSON() as Record<string, unknown>;
  const { password: _, ...userWithoutPassword } = userObj;
  return userWithoutPassword;
};

const getSortField = (sortBy: unknown): string => {
  return sortBy === 'name' || sortBy === 'email' || sortBy === 'address' || sortBy === 'role'
    ? sortBy
    : 'createdAt';
};

const getSortDirection = (sortOrder: unknown): 'ASC' | 'DESC' => {
  return sortOrder === 'asc' ? 'ASC' : 'DESC';
};

export const getUsers = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const {
      name,
      email,
      address,
      role,
      sortBy,
      sortOrder,
      page = '1',
      limit = '20',
    } = req.query;

    const where: Record<string, unknown> = {};

    if (name) where.name = { [Op.iLike]: `%${name}%` };
    if (email) where.email = { [Op.iLike]: `%${email}%` };
    if (address) where.address = { [Op.iLike]: `%${address}%` };
    if (role) where.role = role;

    const sortField = getSortField(sortBy);
    const sortDirection = getSortDirection(sortOrder);

    const pageNum = Math.max(1, parseInt(page as string, 10) || 1);
    const limitNum = Math.max(1, parseInt(limit as string, 10) || 20);
    const offset = (pageNum - 1) * limitNum;

    const { rows: users, count: total } = await User.findAndCountAll({
      where,
      attributes: { exclude: ['password'] },
      order: [[sortField, sortDirection]],
      offset,
      limit: limitNum,
    });

    successResponse(
      res,
      {
        users,
        pagination: {
          page: pageNum,
          limit: limitNum,
          total,
          totalPages: Math.ceil(total / limitNum),
        },
      },
      'Users retrieved successfully.'
    );
  } catch (error) {
    next(error);
  }
};

export const getUserById = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = Number(req.params.id);
    if (!Number.isInteger(userId) || userId < 1) {
      errorResponse(res, 'User not found.', 404);
      return;
    }

    const user = await User.findByPk(userId);
    if (!user) {
      errorResponse(res, 'User not found.', 404);
      return;
    }

    const userData: Record<string, unknown> = excludePassword(user);

    if (user.role === 'store_owner') {
      const store = await Store.findOne({ where: { ownerId: user.id } });
      if (store) {
        const avgResult = await Rating.findOne({
          where: { storeId: store.id },
          attributes: [[sequelize.fn('AVG', sequelize.col('value')), 'averageRating']],
          raw: true,
        });
        const averageRating = Number(
          (avgResult as { averageRating?: string | number } | null)?.averageRating ?? 0
        );
        userData.storeAverageRating = Math.round(averageRating * 10) / 10;
      }
    }

    successResponse(res, userData, 'User retrieved successfully.');
  } catch (error) {
    next(error);
  }
};

export const createUser = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { name, email, address, password, role } = req.body;

    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      errorResponse(res, 'Email already registered.', 409);
      return;
    }

    const user = await User.create({ name, email, address, password, role });

    successResponse(
      res,
      excludePassword(user),
      'User created successfully.',
      201
    );
  } catch (error) {
    next(error);
  }
};

export const changePassword = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { currentPassword, newPassword } = req.body;

    const user = await User.findByPk(req.user?.id);
    if (!user) {
      errorResponse(res, 'User not found.', 404);
      return;
    }

    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) {
      errorResponse(res, 'Current password is incorrect.', 400);
      return;
    }

    user.password = newPassword;
    await user.save();

    successResponse(res, null, 'Password updated successfully.');
  } catch (error) {
    next(error);
  }
};
