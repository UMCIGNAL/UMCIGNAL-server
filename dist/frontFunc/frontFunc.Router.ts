import Router from 'express';
import { operationFrontController, signUpController } from './frontFunc.Controller/frontFunc.Controller';
import { authenticateToken } from '../security/JWT/auth.jwt';

const router = Router();

router.get('/operationFront', authenticateToken, operationFrontController);
router.post('/signUpFront', authenticateToken, signUpController);

export default router;