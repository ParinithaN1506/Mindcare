import { Router } from 'express';
import { MoodController } from '../controllers/MoodController';
import { authenticate } from '../middleware/auth';

const router = Router();

router.post('/add', authenticate, MoodController.addEntry);
router.get('/history', authenticate, MoodController.getHistory);
router.get('/analytics', authenticate, MoodController.getAnalytics);

export default router;
