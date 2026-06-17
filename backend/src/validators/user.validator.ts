import { check } from 'express-validator';

const passwordRegex = /^(?=.*[A-Z])(?=.*[^A-Za-z0-9])/;

export const createUserValidator = [
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
    .isIn(['admin', 'user', 'store_owner'])
    .withMessage('Role must be admin, user, or store_owner'),
];

export const changePasswordValidator = [
  check('currentPassword')
    .notEmpty()
    .withMessage('Current password is required'),
  check('newPassword')
    .isLength({ min: 8, max: 16 })
    .withMessage('New password must be between 8 and 16 characters')
    .matches(passwordRegex)
    .withMessage('New password must contain at least one uppercase letter and one special character'),
];
