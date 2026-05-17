import { Router } from 'express';
import { SupportController } from '../controllers/SupportController';

const router = Router();

router.get('/resources', SupportController.getResources);

export default router;
