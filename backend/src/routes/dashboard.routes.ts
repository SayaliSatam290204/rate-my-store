import { Router } from 'express';
import { getStats } from '../controllers/dashboard.controller';
import { verifyToken } from '../middleware/auth.middleware';
import { authorizeRoles } from '../middleware/role.middleware';

const router = Router();

router.get('/stats', verifyToken, authorizeRoles('admin'), getStats);

export default router;
