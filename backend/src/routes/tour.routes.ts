import { Router } from 'express';
import { TourController } from '../controllers/tour.controller';
import { authenticate } from '../middlewares/auth';

const router = Router();

router.use(authenticate);

router.get('/', TourController.getAll);
router.get('/:id', TourController.getById);
router.post('/', TourController.create);
router.put('/:id', TourController.update);
router.delete('/:id', TourController.delete);
router.post('/:id/start', TourController.start);
router.post('/:id/complete', TourController.complete);
router.put('/:id/steps/:stepId', TourController.updateStep);

export default router;



