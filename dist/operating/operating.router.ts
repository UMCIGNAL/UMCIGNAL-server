import {Router} from 'express';
import { checkSignUpController } from './operating.contoroller/operating.controller';
import { authenticateToken } from '../security/JWT/auth.jwt';

const router = Router();

router.get('/checkSignUp', authenticateToken, checkSignUpController);

/**
 * @swagger
 * /operating/checkSignUp:
 *   get:
 *     summary: 회원가입 및 이상형 정보 입력 여부 확인
 *     description: 사용자의 회원가입 여부와 이상형 정보 입력 여부를 확인하는 API
 *     tags:
 *       - operating
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: 회원가입과 이상형 정보를 모두 입력한 유저
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 회원가입과 이상형 정보를 모두 넣은 유저입니다.
 *       401:
 *         description: 토큰이 유효하지 않음
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 토큰이 유효하지 않습니다.
 *       402:
 *         description: 로그인되어 있지 않음
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 로그인 되어있지 않습니다.
 *       403:
 *         description: 회원가입을 하지 않았거나 이상형 정보를 입력하지 않음
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 signUpStatus:
 *                   type: boolean
 *                   example: false
 *                 idleTypeStatus:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: 회원가입은 했지만 이상형 정보를 입력하지 않았습니다.
 *       404:
 *         description: 토큰이 없음
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 토큰이 없습니다.
 *       500:
 *         description: 서버 오류 발생
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 서버 오류가 발생했습니다.
 */

export default router;