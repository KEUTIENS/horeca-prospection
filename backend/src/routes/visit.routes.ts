import { Router } from 'express';
import { VisitController } from '../controllers/visit.controller';
import { authenticate } from '../middlewares/auth';

const router = Router();

router.use(authenticate);

router.get('/', VisitController.getAll);
router.get('/stats', VisitController.getStats);
router.get('/:id', VisitController.getById);
router.post('/', VisitController.create);
router.put('/:id', VisitController.update);
router.delete('/:id', VisitController.delete);

export default router;



