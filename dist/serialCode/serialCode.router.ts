import { Router } from 'express';
import { getCode } from '../middlware/serialCode.middleware';
import { insertCodeController, myRerollController } from './serialCode.controller/serialCode.controller';

const router = Router();

// router.get('/getCode', getCode);
router.patch('/insertCode', insertCodeController);
router.get('/myReroll', myRerollController);

/**
 * @ swagger
 * /serialCode/getCode:
 *   get:
 *     summary: 시리얼 코드를 생성합니다.
 *     description: Fetches a serial code from the database. The serial code is generated in middleware.
 *     tags:
 *       - Serial Code
 *     responses:
 *       200:
 *         description: Successfully retrieved serial code.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code:
 *                   type: string
 *                   example: "ABCD1234"
 *                 userAgeCheck:
 *                   type: boolean
 *                   example: true
 *       500:
 *         description: Internal server error
 */


/**
 * @swagger
 * /serialCode/insertCode:
 *   patch:
 *     summary: "시리얼 코드 입력"
 *     description: "사용자가 시리얼 코드를 입력하면 해당 코드가 유효한지 확인하고 추가합니다."
 *     tags:
 *       - Serial Code
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               serialCode:
 *                 type: string
 *                 example: "ABCD1234"
 *     responses:
 *       202:
 *         description: "코드가 정상적으로 추가됨"
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 result:
 *                   type: integer
 *                 message:
 *                   type: string
 *                   example: "코드가 정상적으로 추가되었습니다."
 *       401:
 *         description: "토큰이 유효하지 않거나 로그인되지 않음"
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "로그인 되어있지 않습니다."
 *       404:
 *         description: "토큰 또는 코드가 입력되지 않음, 존재하지 않는 코드"
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "존재하지 않는 코드입니다."
 *       500:
 *         description: "서버 에러"
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
 * /serialCode/myReroll:
 *   get:
 *     summary: 내 리롤 횟수를 조회합니다.
 *     description: 사용자의 인증 토큰을 확인한 후, 해당 사용자의 리롤 정보를 반환합니다.
 *     tags:
 *       - Serial Code
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       202:
 *         description: 코드가 정상적으로 추가됨
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 result:
 *                   type: object
 *                   description: 리롤 서비스 결과 데이터
 *                 message:
 *                   type: string
 *                   example: 코드가 정상적으로 추가되었습니다.
 *       401:
 *         description: 인증 오류 (유효하지 않은 토큰 또는 로그인 필요)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 로그인 되어있지 않습니다.
 *       404:
 *         description: 요청에 토큰이 없음
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 토큰이 없습니다.
 *       500:
 *         description: 서버 에러
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 서버 에러입니다.
 */

export default router;