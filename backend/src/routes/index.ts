import { Router } from 'express';
import authRoutes from './auth.routes';
import userRoutes from './user.routes';
import prospectRoutes from './prospect.routes';
import visitRoutes from './visit.routes';
import tourRoutes from './tour.routes';
import statsRoutes from './stats.routes';

const router = Router();

router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/prospects', prospectRoutes);
router.use('/visits', visitRoutes);
router.use('/tours', tourRoutes);
router.use('/stats', statsRoutes);

export default router;



