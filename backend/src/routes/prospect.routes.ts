import { Router } from 'express';
import { ProspectController } from '../controllers/prospect.controller';
import { authenticate } from '../middlewares/auth';

const router = Router();

router.use(authenticate);

router.get('/', ProspectController.getAll);
router.get('/nearby', ProspectController.getNearby);
router.get('/:id', ProspectController.getById);
router.post('/', ProspectController.create);
router.put('/:id', ProspectController.update);
router.delete('/:id', ProspectController.delete);
router.post('/:id/enrich', ProspectController.enrich);

export default router;



