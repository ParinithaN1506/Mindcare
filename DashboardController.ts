import { Router } from 'express';
import moodRoutes from './moodRoutes';
import journalRoutes from './journalRoutes';
import adminRoutes from './adminRoutes';
import productivityRoutes from './productivityRoutes';
import supportRoutes from './supportRoutes';
import dashboardRoutes from './dashboardRoutes';
import wellnessRoutes from './wellnessRoutes';
import aiRoutes from './aiRoutes';
import { AuthController } from '../controllers/AuthController';
import { authenticate } from '../middleware/auth';

const router = Router();

// Auth routes
router.post('/auth/sync', authenticate, AuthController.syncProfile);
router.get('/auth/profile', authenticate, AuthController.getProfile);

router.use('/moods', moodRoutes);
router.use('/journal', journalRoutes);
router.use('/admin', adminRoutes);
router.use('/productivity', productivityRoutes);
router.use('/support', supportRoutes);
router.use('/dashboard', dashboardRoutes);
router.use('/wellness', wellnessRoutes);
router.use('/ai', aiRoutes);

export default router;
