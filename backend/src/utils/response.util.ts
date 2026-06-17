import { Response } from 'express';

export const successResponse = (
  res: Response,
  data: unknown,
  message: string,
  statusCode = 200
): Response => {
  return res.status(statusCode).json({
    success: true,
    data,
    message,
  });
};

export const errorResponse = (
  res: Response,
  message: string,
  statusCode = 400,
  errors?: unknown
): Response => {
  return res.status(statusCode).json({
    success: false,
    data: null,
    message,
    ...(errors !== undefined && { errors }),
  });
};
