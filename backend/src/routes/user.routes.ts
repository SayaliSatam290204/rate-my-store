import { Router } from 'express';
import {
  getUsers,
  getUserById,
  createUser,
  changePassword,
} from '../controllers/user.controller';
import { verifyToken } from '../middleware/auth.middleware';
import { authorizeRoles } from '../middleware/role.middleware';
import { validate } from '../middleware/validate.middleware';
import {
  createUserValidator,
  changePasswordValidator,
} from '../validators/user.validator';

const router = Router();

router.use(verifyToken);

router.get('/', authorizeRoles('admin'), getUsers);
router.patch('/change-password', changePasswordValidator, validate, changePassword);
router.get('/:id', authorizeRoles('admin'), getUserById);
router.post('/', authorizeRoles('admin'), createUserValidator, validate, createUser);

export default router;
