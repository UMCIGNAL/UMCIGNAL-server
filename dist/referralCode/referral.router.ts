import Router from 'express';
import { findReferralController, getMyReferralCodeController } from './referral.controller/referral.controller';
import { authenticateToken } from '../security/JWT/auth.jwt';


const router = Router();

router.get('/', (req, res) => {
    res.json('referral Router');
});

router.patch('/findReferralCode', authenticateToken, findReferralController);
router.get('/getMyReferralCode', authenticateToken, getMyReferralCodeController);


/**
 * @swagger
 * /referral/findReferralCode:
 *   patch:
 *     summary: "추천인 코드 적용"
 *     description: "사용자가 추천인 코드를 입력하면 해당 코드가 적용됩니다."
 *     tags:
 *       - referral
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               referralCode:
 *                 type: string
 *                 description: "추천인 코드"
 *                 example: "ABC123"
 *     responses:
 *       200:
 *         description: "추천인 코드가 정상적으로 적용됨"
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 result:
 *                   type: object
 *                   example: { "user_id": 1, "referral_code": "ABC123" }
 *                 message:
 *                   type: string
 *                   example: "추천인 코드가 적용되었습니다."
 *       400:
 *         description: "추천 코드가 없는 경우"
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "추천 코드가 없습니다."
 *       401:
 *         description: "인증 실패 (토큰 없음 또는 로그인되지 않음)"
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "로그인 되어있지 않습니다."
 *       500:
 *         description: "서버 오류"
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "서버 에러입니다."
 */


/**
 * @swagger
 * /referral/getMyReferralCode:
 *   get:
 *     summary: "사용자의 추천인 코드 조회"
 *     description: "현재 로그인한 사용자의 추천인 코드를 조회합니다."
 *     tags:
 *       - referral
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: "추천인 코드 조회 성공"
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "추천인 코드는 "
 *                 result:
 *                   type: string
 *                   example: "ABC123"
 *       400:
 *         description: "추천 코드가 없는 경우"
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "추천 코드가 없습니다."
 *       401:
 *         description: "인증 실패 (토큰 없음 또는 로그인되지 않음)"
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "로그인 되어있지 않습니다."
 *       500:
 *         description: "서버 오류"
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "서버 에러입니다."
 */

export default router;