import { Router } from 'express';
import { submitRating, getMyStoreRatings } from '../controllers/rating.controller';
import { verifyToken } from '../middleware/auth.middleware';
import { authorizeRoles } from '../middleware/role.middleware';
import { validate } from '../middleware/validate.middleware';
import { ratingValidator } from '../validators/rating.validator';

const router = Router();

router.use(verifyToken);

router.post('/', authorizeRoles('user'), ratingValidator, validate, submitRating);
router.get('/my-store', authorizeRoles('store_owner'), getMyStoreRatings);

export default router;
