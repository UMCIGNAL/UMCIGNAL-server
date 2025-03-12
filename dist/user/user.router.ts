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

/**
 * @swagger
 * /user/mailCode:
 *   post:
 *     summary: 이메일을 통한 인증 코드 전송
 *     description: 상명대학교 이메일 sangmyung.kr 또는 gmail.com 이메일을 통한 인증 코드 전송
 *     tags:
 *       - Verification
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               mail:
 *                 type: string
 *                 example: "본인학번@sangmyung.kr"
 *     responses:
 *       200:
 *         description: Mail sent successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 userId:
 *                   type: string
 *                   example: "1"
 *                 message:
 *                   type: string
 *                   example: "메일 전송 완료"
 *       400:
 *         description: Invalid email format or already registered
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "이메일 형식이 올바르지 않습니다."
 */

/**
 * @swagger
 * /user/verify:
 *   post:
 *     summary: 이메일 인증 코드 검증 및 토큰 발급
 *     description: 사용자가 제공한 이메일 인증 코드를 검증합니다.
 *     tags:
 *       - Verification
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               mailVerification:
 *                 type: string
 *                 example: "123456"
 *     responses:
 *       200:
 *         description: 메일 인증 완료
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "메일 인증 완료"
 *                 token:
 *                   type: string
 *                   example: "your_generated_token"
 *       400:
 *         description: 인증 코드가 잘못되었거나, 형식이 맞지 않음
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "인증 코드는 6자리입니다."
 *       500:
 *         description: 서버 오류
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "서버 오류가 발생했습니다."
 */

/**
 * @swagger
 * /user/signup:
 *   patch:
 *     summary: 사용자 회원가입
 *     description: 사용자가 Mail의 검증이 끝났다면 회원 정보를 수정합니다. - 기존 회원이면 넘어가도 상관 없습니다.
 *     tags:
 *       - Verification
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               gender:
 *                 type: string
 *                 example: "Male"
 *               student_major:
 *                 type: string
 *                 example: "컴퓨터과학과"
 *               MBTI:
 *                 type: string
 *                 example: "ESTJ"
 *               is_smoking:
 *                 type: boolean
 *                 example: false
 *               is_drinking:
 *                 type: number
 *                 example: 1
 *               instagram_id:
 *                 type: string
 *                 example: "wwnnss06"
 *     responses:
 *       201:
 *         description: 회원가입 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "회원가입 성공"
 *                 data:
 *                   type: object
 *                   description: 회원가입된 사용자 데이터
 *       400:
 *         description: 필수 입력값 누락 또는 잘못된 값
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "필수 입력값이 누락되었습니다."
 *                 missingFields:
 *                   type: array
 *                   items:
 *                     type: string
 *                   example: ["gender", "student_major"]
 *       401:
 *         description: 인증되지 않은 요청 (토큰이 없거나 유효하지 않음)
 *       500:
 *         description: 서버 오류
 */



export default router;