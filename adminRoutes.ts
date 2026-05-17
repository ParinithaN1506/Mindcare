import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import { adminDb } from '../config/firebase';
import { AIService } from '../services/aiService';

export class MoodController {
  static async addEntry(req: AuthRequest, res: Response) {
    try {
      const { moodType, moodIntensity, stressLevel, notes } = req.body;
      const userId = req.user?.uid;

      if (!userId) return res.status(401).json({ error: 'User not found' });

      const entry = {
        userId,
        moodType,
        moodIntensity,
        stressLevel,
        notes,
        createdAt: new Date(),
      };

      const docRef = await adminDb.collection('moodEntries').add(entry);

      // Trigger AI analysis if needed or just return success
      res.status(201).json({ id: docRef.id, ...entry });
    } catch (error) {
      res.status(500).json({ error: 'Failed to add mood entry' });
    }
  }

  static async getHistory(req: AuthRequest, res: Response) {
    try {
      const userId = req.user?.uid;
      const snapshot = await adminDb.collection('moodEntries')
        .where('userId', '==', userId)
        .orderBy('createdAt', 'desc')
        .limit(50)
        .get();

      const entries = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      res.json(entries);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch history' });
    }
  }

  static async getAnalytics(req: AuthRequest, res: Response) {
    try {
      const userId = req.user?.uid;
      const snapshot = await adminDb.collection('moodEntries')
        .where('userId', '==', userId)
        .orderBy('createdAt', 'desc')
        .limit(10)
        .get();

      const entries = snapshot.docs.map(doc => doc.data());
      
      if (entries.length === 0) {
        return res.json({ message: 'Insufficient data for analysis' });
      }

      const analysis = await AIService.analyzeMoodPatterns(entries);
      res.json(analysis);
    } catch (error) {
      res.status(500).json({ error: 'Failed to generate analytics' });
    }
  }
}
