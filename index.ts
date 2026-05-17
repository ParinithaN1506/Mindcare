import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import { adminDb } from '../config/firebase';
import { AIService } from '../services/aiService';

export class JournalController {
  static async addJournal(req: AuthRequest, res: Response) {
    try {
      const { title, content, privacyMode } = req.body;
      const userId = req.user?.uid;

      if (!userId) return res.status(401).json({ error: 'User not found' });

      // Call AI Service for sentiment and keyword extraction
      const aiAnalysis = await AIService.summarizeJournal(content);

      const journal = {
        userId,
        title,
        content,
        privacyMode,
        sentiment: aiAnalysis.sentimentScore,
        summary: aiAnalysis.summary,
        keywords: aiAnalysis.keywords,
        createdAt: new Date(),
      };

      const docRef = await adminDb.collection('journals').add(journal);

      // Create a background AI Insight if sentiment is very low
      if (aiAnalysis.sentimentScore < -0.5) {
        await adminDb.collection('aiInsights').add({
          userId,
          insightType: 'Emotional Divergence',
          content: 'A recent journal entry detected significant emotional distress. We recommend checking in with our support nodes.',
          riskLevel: 'medium',
          createdAt: new Date()
        });
      }

      res.status(201).json({ id: docRef.id, ...journal });
    } catch (error) {
      console.error('Journal error:', error);
      res.status(500).json({ error: 'Failed to save journal' });
    }
  }

  static async getAll(req: AuthRequest, res: Response) {
    try {
      const userId = req.user?.uid;
      const snapshot = await adminDb.collection('journals')
        .where('userId', '==', userId)
        .orderBy('createdAt', 'desc')
        .get();

      const journals = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      res.json(journals);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch journals' });
    }
  }

  static async deleteJournal(req: AuthRequest, res: Response) {
    try {
      const { id } = req.params;
      const userId = req.user?.uid;

      const docRef = adminDb.collection('journals').doc(id);
      const doc = await docRef.get();

      if (!doc.exists) return res.status(404).json({ error: 'Journal not found' });
      if (doc.data()?.userId !== userId) return res.status(403).json({ error: 'Unauthorized' });

      await docRef.delete();
      res.json({ message: 'Journal deleted successfully' });
    } catch (error) {
      res.status(500).json({ error: 'Failed to delete journal' });
    }
  }
}
