import Router from 'express';
import { operationFrontController } from './frontFunc.Controller/frontFunc.Controller';
import { authenticateToken } from '../security/JWT/auth.jwt';

const router = Router();

router.get('/operationFront', authenticateToken, operationFrontController);


export default router;