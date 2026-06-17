import { Response, NextFunction } from 'express';
import { AuthRequest } from '../types';
import { errorResponse } from '../utils/response.util';

export const authorizeRoles = (...roles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction): void => {
    if (!req.user || !roles.includes(req.user.role)) {
      errorResponse(res, 'Access denied. Insufficient permissions.', 403);
      return;
    }
    next();
  };
};
