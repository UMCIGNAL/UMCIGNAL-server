import Router from 'express';
import { frontRerollController, operationFrontController, signUpController } from './frontFunc.Controller/frontFunc.Controller';
import { authenticateToken } from '../security/JWT/auth.jwt';

const router = Router();

router.get('/operationFront', authenticateToken, operationFrontController);
router.post('/signUpFront', authenticateToken, signUpController);
router.get('frontReroll', authenticateToken, frontRerollController);

export default router;