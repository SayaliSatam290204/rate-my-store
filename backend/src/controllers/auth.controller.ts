import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { User } from '../models/User';
import { JwtPayload } from '../types';
import { successResponse, errorResponse } from '../utils/response.util';

const generateToken = (payload: JwtPayload): string => {
  return jwt.sign(payload, process.env.JWT_SECRET as string, {
    expiresIn: '7d',
  });
};

const excludePassword = (user: User): Record<string, unknown> => {
  const userObj = user.toJSON() as Record<string, unknown>;
  const { password: _, ...userWithoutPassword } = userObj;
  return userWithoutPassword;
};

export const register = async (
  req: Request,
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

    const user = await User.create({
      name,
      email,
      address,
      password,
      role: role || 'user',
    });

    const token = generateToken({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    });

    successResponse(
      res,
      { user: excludePassword(user), token },
      'Registration successful.',
      201
    );
  } catch (error) {
    next(error);
  }
};

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ where: { email } });
    if (!user) {
      errorResponse(res, 'Invalid email or password.', 401);
      return;
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      errorResponse(res, 'Invalid email or password.', 401);
      return;
    }

    const token = generateToken({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    });

    successResponse(res, { user: excludePassword(user), token }, 'Login successful.');
  } catch (error) {
    next(error);
  }
};
