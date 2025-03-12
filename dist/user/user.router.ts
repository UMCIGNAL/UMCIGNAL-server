import express from 'express';
import { mailVerifyController, sendMailCodeController, userSignupController } from './user.controller/user.controller';
import { authenticateToken } from '../security/JWT/auth.jwt';

const router = express.Router();

router.get('/', (req, res) => {
    res.json({ message: 'user router' });
});

router.post('/mailCode', sendMailCodeController);
router.post('/verify', mailVerifyController);
router.patch('/signup', authenticateToken, userSignupController); // 이미 가입한 회원 처리 끝



export default router;