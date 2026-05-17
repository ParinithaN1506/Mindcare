import { Response, Request } from 'express';
import { adminDb } from '../config/firebase';

export class SupportController {
  static async getResources(req: Request, res: Response) {
    try {
      const snapshot = await adminDb.collection('emergencyResources').get();
      
      let resources = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

      // If empty, provide default system resources
      if (resources.length === 0) {
        resources = [
          {
            title: 'Campus Crisis Line',
            contact: '1-800-CAMPUS',
            description: 'Available 24/7 for immediate psychological support.',
            category: 'crisis'
          },
          {
            title: 'Student Wellness Portal',
            url: 'https://wellness.university.edu',
            description: 'Online resources and scheduling for wellness centers.',
            category: 'resource'
          }
        ] as any;
      }

      res.json(resources);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch support resources' });
    }
  }
}
