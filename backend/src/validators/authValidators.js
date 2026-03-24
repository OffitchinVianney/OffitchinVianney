import { body } from 'express-validator';

export const registerValidator = [
  body('email').isEmail().normalizeEmail(),
  body('password')
    .isLength({ min: 10 })
    .matches(/[A-Z]/)
    .matches(/[a-z]/)
    .matches(/[0-9]/)
    .withMessage('Password must be strong'),
  body('fullName').trim().isLength({ min: 2, max: 70 })
];

export const loginValidator = [
  body('email').isEmail().normalizeEmail(),
  body('password').isString().isLength({ min: 1 })
];
