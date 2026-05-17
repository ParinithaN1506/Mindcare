import { Router } from 'express';
import { AdminController } from '../controllers/AdminController';
import { authenticate, authorize } from '../middleware/auth';

const router = Router();

router.get('/users', authenticate, authorize(['admin']), AdminController.getUsers);
router.get('/analytics', authenticate, authorize(['admin']), AdminController.getRiskAnalytics);
router.delete('/delete/:id', authenticate, authorize(['admin']), AdminController.deleteUser);
router.get('/report', authenticate, authorize(['admin']), AdminController.generateSystemReport);

export default router;
