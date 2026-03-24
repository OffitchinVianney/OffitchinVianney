import { Router } from 'express';
import { authLimiter } from '../middlewares/security.js';
import { validateRequest } from '../middlewares/validate.js';
import { getCsrfToken, login, logout, register } from '../controllers/authController.js';
import { loginValidator, registerValidator } from '../validators/authValidators.js';
import { csrfProtection } from '../middlewares/csrf.js';

const router = Router();

router.get('/csrf-token', csrfProtection, getCsrfToken);
router.post('/register', authLimiter, csrfProtection, registerValidator, validateRequest, register);
router.post('/login', authLimiter, csrfProtection, loginValidator, validateRequest, login);
router.post('/logout', csrfProtection, logout);

export default router;
