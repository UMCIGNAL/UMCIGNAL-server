import Router from 'express';
import { frontRerollController, operationFrontController, signUpController } from './frontFunc.Controller/frontFunc.Controller';
import { authenticateToken } from '../security/JWT/auth.jwt';

const router = Router();

router.get('/operationFront', authenticateToken, operationFrontController);
router.post('/signUpFront', authenticateToken, signUpController);
router.get('/frontReroll', authenticateToken, frontRerollController);

export default router;

/**
 * @swagger
 * tags:
 *   name: Operation Front
 *   description: API for operation front actions.
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     successMessage:
 *       type: object
 *       properties:
 *         statusCode:
 *           type: integer
 *           description: HTTP 상태 코드
 *         customCode:
 *           type: string
 *           description: 커스텀 응답 코드
 *         user_id:
 *           type: integer
 *           description: 사용자의 ID (선택적)
 *         instagram_id:
 *           type: string
 *           description: 사용자의 Instagram ID (선택적)
 *         message:
 *           type: string
 *           description: 응답 메시지
 *       required:
 *         - statusCode
 *         - customCode
 *         - message
 *     errorMessage:
 *       type: object
 *       properties:
 *         statusCode:
 *           type: integer
 *           description: HTTP 상태 코드
 *         customCode:
 *           type: string
 *           description: 커스텀 에러 코드
 *         message:
 *           type: string
 *           description: 에러 메시지
 *       required:
 *         - statusCode
 *         - customCode
 *         - message
 */


/**
 * @swagger
 * /frontFunc/operationFront:
 *   get:
 *     summary: 회원가입 상태 확인 API
 *     description: 사용자의 토큰을 확인하여 회원가입 상태를 반환합니다.
 *     tags: [aFront-new]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: "회원가입 완료된 유저"
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "정상적으로 회원가입이 완료된 유저입니다."
 *       401:
 *         description: "토큰이 유효하지 않음"
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "인증 오류, 토큰이 존재하지 않습니다."
 *       403:
 *         description: "만료된 토큰"
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "만료된 토큰입니다."
 *       400:
 *         description: "회원가입을 하지 않은 유저"
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "회원 정보를 입력하지 않은 유저입니다."
 *       500:
 *         description: "서버 오류 발생"
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
 * /frontFunc/signUpFront:
 *   post:
 *     summary: 사용자 회원가입 API
 *     description: 사용자의 회원가입 정보를 받아 회원가입을 처리합니다.
 *     tags: [aFront-new]
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
 *                 description: 사용자의 성별
 *               instagram_id:
 *                 type: string
 *                 description: 사용자의 Instagram ID
 *             required:
 *               - gender
 *               - instagram_id
 *     responses:
 *       200:
 *         description: "회원가입 성공"
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "정상적으로 회원가입이 완료된 유저입니다."
 *       401:
 *         description: "토큰이 유효하지 않음"
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "인증 오류, 토큰이 존재하지 않습니다."
 *       403:
 *         description: "만료된 토큰"
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "만료된 토큰입니다."
 *       400:
 *         description: "누락된 필드 존재"
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "누락값이 존재합니다."
 *       500:
 *         description: "서버 오류 발생"
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
 * /frontFunc/frontReroll:
 *   get:
 *     summary: 리롤 결과 조회 API
 *     description: 사용자의 리롤 결과를 확인하고, Instagram ID를 반환합니다.
 *     tags: [aFront-new]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: "리롤 성공"
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "매칭이 완료되었습니다."
 *                 instagram_id:
 *                   type: string
 *                   example: "user_instagram_id"
 *       401:
 *         description: "토큰이 유효하지 않음"
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "인증 오류, 토큰이 존재하지 않습니다."
 *       403:
 *         description: "만료된 토큰"
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "만료된 토큰입니다."
 *       400:
 *         description: "리롤 횟수 초과"
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "리롤 횟수를 모두 소진하였습니다."
 *       404:
 *         description: "이상형 정보 없음"
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "이상형을 찾지 못 했습니다."
 *       500:
 *         description: "서버 오류 발생"
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "서버 에러입니다."
 */