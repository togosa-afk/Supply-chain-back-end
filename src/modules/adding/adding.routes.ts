import express from 'express';
import { add } from './adding.controller';
import { validate } from '../../middleware/validate.middleware';
import { productSchema } from './adding.validation';
import { authenticateJWT } from '../../middleware/auth.middleware';

const router = express.Router();

router.post('/service/addproduct', authenticateJWT, validate(productSchema), add);

export default router;
