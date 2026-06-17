import { Router } from 'express';
import { getStores, createStore } from '../controllers/store.controller';
import { verifyToken } from '../middleware/auth.middleware';
import { authorizeRoles } from '../middleware/role.middleware';
import { validate } from '../middleware/validate.middleware';
import { createStoreValidator } from '../validators/store.validator';

const router = Router();

router.use(verifyToken);

router.get('/', getStores);
router.post('/', authorizeRoles('admin'), createStoreValidator, validate, createStore);

export default router;
