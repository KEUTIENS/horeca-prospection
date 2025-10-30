import { Router } from 'express';
import { StatsController } from '../controllers/stats.controller';
import { authenticate } from '../middlewares/auth';

const router = Router();

router.use(authenticate);

router.get('/overview', StatsController.getOverview);
router.get('/conversions', StatsController.getConversions);
router.get('/heatmap', StatsController.getHeatmap);
router.get('/by-user', StatsController.getByUser);

export default router;



