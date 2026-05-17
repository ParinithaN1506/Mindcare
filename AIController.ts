import { Router } from 'express';
import { ProductivityController } from '../controllers/ProductivityController';
import { authenticate } from '../middleware/auth';

const router = Router();

router.post('/log', authenticate, ProductivityController.logSession);
router.get('/stats', authenticate, ProductivityController.getStats);

export default router;
