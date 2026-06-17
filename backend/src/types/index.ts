import { Request } from 'express';

export type UserRole = 'admin' | 'user' | 'store_owner';

export interface JwtPayload {
  id: number;
  name: string;
  email: string;
  role: UserRole;
}

export interface AuthRequest extends Request {
  user?: JwtPayload;
}
