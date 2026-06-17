import { check } from 'express-validator';

export const createStoreValidator = [
  check('name')
    .trim()
    .notEmpty()
    .withMessage('Name is required')
    .isLength({ min: 20, max: 60 })
    .withMessage('Name must be between 20 and 60 characters'),
  check('email')
    .trim()
    .isEmail()
    .withMessage('Valid email is required')
    .normalizeEmail(),
  check('address')
    .trim()
    .notEmpty()
    .withMessage('Address is required')
    .isLength({ max: 400 })
    .withMessage('Address must not exceed 400 characters'),
  check('ownerId')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Owner ID must be a valid numeric ID'),
];
