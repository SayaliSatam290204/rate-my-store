import { check } from 'express-validator';

const passwordRegex = /^(?=.*[A-Z])(?=.*[^A-Za-z0-9])/;

export const registerValidator = [
  check('name')
    .trim()
    .notEmpty()
    .withMessage('Name is required')
    .isLength({ min: 20, max: 60 })
    .withMessage('Name must be between 20 and 60 characters'),
  check('email')
    .isEmail()
    .withMessage('Valid email is required')
    .normalizeEmail(),
  check('address')
    .trim()
    .notEmpty()
    .withMessage('Address is required')
    .isLength({ max: 400 })
    .withMessage('Address must not exceed 400 characters'),
  check('password')
    .isLength({ min: 8, max: 16 })
    .withMessage('Password must be between 8 and 16 characters')
    .matches(passwordRegex)
    .withMessage('Password must contain at least one uppercase letter and one special character'),
  check('role')
    .optional()
    .isIn(['user', 'store_owner', 'admin'])
    .withMessage('Role must be user, store_owner, or admin'),
];

export const loginValidator = [
  check('email').isEmail().withMessage('Valid email is required'),
  check('password').notEmpty().withMessage('Password is required'),
];
