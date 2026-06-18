import { z } from 'zod';

export const nameSchema = z.string().min(20, 'Name must be at least 20 characters').max(60, 'Name must not exceed 60 characters');
export const emailSchema = z.string().email('Invalid email address');
export const addressSchema = z.string().max(400, 'Address must not exceed 400 characters');
export const passwordSchema = z
  .string()
  .min(8, 'Password must be at least 8 characters')
  .max(16, 'Password must not exceed 16 characters')
  .regex(
    /^(?=.*[A-Z])(?=.*[^A-Za-z0-9])/,
    'Must contain uppercase and special character'
  );

export const registerSchema = z.object({
  name: nameSchema,
  email: emailSchema,
  address: addressSchema.min(1, 'Address is required'),
  password: passwordSchema,
  role: z.enum(['admin', 'user', 'store_owner']),
});

export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, 'Password is required'),
});

export const createUserSchema = z.object({
  name: nameSchema,
  email: emailSchema,
  address: addressSchema.min(1, 'Address is required'),
  password: passwordSchema,
  role: z.enum(['admin', 'user', 'store_owner']),
});

export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, 'Current password is required'),
    newPassword: passwordSchema,
    confirmPassword: z.string().min(1, 'Please confirm your password'),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

export const createStoreSchema = z.object({
  name: nameSchema,
  email: emailSchema,
  address: addressSchema.min(1, 'Address is required'),
  ownerId: z.string().optional(),
});

export const ratingSchema = z.object({
  value: z.number().min(1).max(5),
});

export type RegisterFormData = z.infer<typeof registerSchema>;
export type LoginFormData = z.infer<typeof loginSchema>;
export type CreateUserFormData = z.infer<typeof createUserSchema>;
export type ChangePasswordFormData = z.infer<typeof changePasswordSchema>;
export type CreateStoreFormData = z.infer<typeof createStoreSchema>;
