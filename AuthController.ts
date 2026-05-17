import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import { adminDb, adminAuth } from '../config/firebase';

export class AdminController {
  static async getUsers(req: AuthRequest, res: Response) {
    try {
      const snapshot = await adminDb.collection('users').get();
      const users = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      res.json(users);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch user directory' });
    }
  }

  static async getRiskAnalytics(req: AuthRequest, res: Response) {
    try {
      // Aggregate risk insights from AI insights collection
      const snapshot = await adminDb.collection('aiInsights')
        .where('riskLevel', '==', 'high')
        .orderBy('createdAt', 'desc')
        .limit(20)
        .get();

      const risks = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      res.json(risks);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch risk analytics' });
    }
  }

  static async deleteUser(req: AuthRequest, res: Response) {
    try {
      const { id } = req.params;
      
      // Delete from Firebase Auth
      await adminAuth.deleteUser(id);
      
      // Delete from Firestore
      await adminDb.collection('users').doc(id).delete();
      
      // Cleanup associated data (optional but recommended in production)
      // await adminDb.collection('journals').where('userId', '==', id).delete(); ...

      res.json({ message: 'User identity purged from system' });
    } catch (error) {
      res.status(500).json({ error: 'Failed to purge user' });
    }
  }

  static async generateSystemReport(req: AuthRequest, res: Response) {
    try {
      const userCount = (await adminDb.collection('users').count().get()).data().count;
      const moodCount = (await adminDb.collection('moodEntries').count().get()).data().count;
      const highRiskCount = (await adminDb.collection('aiInsights').where('riskLevel', '==', 'high').count().get()).data().count;

      const report = {
        generatedAt: new Date(),
        metrics: {
          totalIdentities: userCount,
          totalInteractions: moodCount,
          criticalDivergences: highRiskCount
        },
        sectorStatus: 'Operational'
      };

      res.json(report);
    } catch (error) {
      res.status(500).json({ error: 'Failed to generate intelligence report' });
    }
  }
}
