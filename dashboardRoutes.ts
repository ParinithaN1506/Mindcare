import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import { adminAuth, adminDb } from '../config/firebase';

export class AuthController {
  static async syncProfile(req: AuthRequest, res: Response) {
    try {
      const { uid, role } = req.user!;
      const profileData = req.body;

      // Ensure role is correctly synced in custom claims for security rules
      if (profileData.role && role !== profileData.role) {
        await adminAuth.setCustomUserClaims(uid, { role: profileData.role });
      }

      await adminDb.collection('users').doc(uid).set({
        ...profileData,
        updatedAt: new Date(),
      }, { merge: true });

      res.json({ message: 'Identity synchronized successfully' });
    } catch (error) {
      res.status(500).json({ error: 'Failed to synchronize identity' });
    }
  }

  static async getProfile(req: AuthRequest, res: Response) {
    try {
      const { uid } = req.user!;
      const doc = await adminDb.collection('users').doc(uid).get();
      
      if (!doc.exists) return res.status(404).json({ error: 'Profile not found' });
      
      res.json(doc.data());
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch identity profile' });
    }
  }
}
