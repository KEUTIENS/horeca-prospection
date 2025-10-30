import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller';
import { authenticate } from '../middlewares/auth';

const router = Router();

router.post('/login', AuthController.login);
router.post('/refresh', AuthController.refresh);
router.post('/logout', AuthController.logout);
router.get('/me', authenticate, AuthController.me);
router.put('/me', authenticate, AuthController.updateMe);
router.post('/change-password', authenticate, AuthController.changePassword);

export default router;



