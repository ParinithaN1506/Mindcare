import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import { adminDb } from '../config/firebase';

export class ProductivityController {
  static async logSession(req: AuthRequest, res: Response) {
    try {
      const { duration, type, notes } = req.body;
      const userId = req.user?.uid;

      if (!userId) return res.status(401).json({ error: 'User not found' });

      const session = {
        userId,
        duration, // in minutes
        type, // 'pomodoro', 'deep-work', etc.
        notes,
        createdAt: new Date(),
      };

      const docRef = await adminDb.collection('productivityLogs').add(session);
      res.status(201).json({ id: docRef.id, ...session });
    } catch (error) {
      res.status(500).json({ error: 'Failed to log focus session' });
    }
  }

  static async getStats(req: AuthRequest, res: Response) {
    try {
      const userId = req.user?.uid;
      const snapshot = await adminDb.collection('productivityLogs')
        .where('userId', '==', userId)
        .orderBy('createdAt', 'desc')
        .limit(30)
        .get();

      const logs = snapshot.docs.map(doc => doc.data());
      const totalMinutes = logs.reduce((acc, log) => acc + (log.duration || 0), 0);

      res.json({
        totalSessions: logs.length,
        totalFocusTime: totalMinutes,
        recentLogs: logs.slice(0, 5)
      });
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch productivity metrics' });
    }
  }
}
