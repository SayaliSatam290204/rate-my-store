import { check } from 'express-validator';

export const ratingValidator = [
  check('storeId')
    .isInt({ min: 1 })
    .withMessage('Store ID must be a valid numeric ID'),
  check('value')
    .isInt({ min: 1, max: 5 })
    .withMessage('Rating value must be between 1 and 5'),
];
