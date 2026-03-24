import { Router } from 'express';
import multer from 'multer';
import { requireAuth } from '../middlewares/auth.js';
import { validateRequest } from '../middlewares/validate.js';
import { csrfProtection } from '../middlewares/csrf.js';
import { me, updateProfile, uploadAvatar } from '../controllers/profileController.js';
import { profileUpdateValidator } from '../validators/profileValidators.js';

const router = Router();
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 2 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (!['image/png', 'image/jpeg', 'image/webp'].includes(file.mimetype)) {
      return cb(new Error('Invalid image format'));
    }
    return cb(null, true);
  }
});

router.get('/me', requireAuth, me);
router.put('/me', requireAuth, csrfProtection, profileUpdateValidator, validateRequest, updateProfile);
router.post('/me/avatar', requireAuth, csrfProtection, upload.single('avatar'), uploadAvatar);

export default router;
