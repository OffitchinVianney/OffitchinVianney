import { body } from 'express-validator';

export const profileUpdateValidator = [
  body('fullName').optional().trim().isLength({ min: 2, max: 70 }),
  body('bio').optional().trim().isLength({ max: 300 })
];
