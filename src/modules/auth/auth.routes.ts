import express from 'express';
import { register, login, updateRole } from './auth.controller';
import { authenticateJWT } from '../../middleware/auth.middleware';
import { validate } from '../../middleware/validate.middleware';
import { registerSchema, loginSchema, updateRoleSchema } from './auth.validation';

const router = express.Router();

router.post('/auth/register', validate(registerSchema), register);
router.post('/auth/login', validate(loginSchema), login);
router.patch('/auth/updaterole', authenticateJWT, validate(updateRoleSchema), updateRole);

export default router;