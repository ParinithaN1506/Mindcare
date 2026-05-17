import { Router } from 'express';
import { JournalController } from '../controllers/JournalController';
import { authenticate } from '../middleware/auth';

const router = Router();

router.post('/add', authenticate, JournalController.addJournal);
router.get('/all', authenticate, JournalController.getAll);
router.delete('/delete/:id', authenticate, JournalController.deleteJournal);

export default router;
