import {Router} from 'express';
import { healthController } from './health.controller/health.controller';

const router = Router();

router.get('/', healthController);

export default router;