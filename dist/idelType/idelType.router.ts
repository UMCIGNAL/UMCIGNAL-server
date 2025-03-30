import Router from 'express';
import { addIdleTypeController, findIdleTypeController, fixIdleTypeController, rerollController } from './idleType.controller/idleType.controller';
import { authenticateToken } from '../security/JWT/auth.jwt';

const router = Router();

router.get('/', (req, res) => {
    res.json('idleType Router');
});

router.post('/addIdleType', authenticateToken, addIdleTypeController);
router.patch('/fixIdleType', authenticateToken, fixIdleTypeController);
router.get('/findIdleType', authenticateToken, findIdleTypeController);
router.get('/reroll', authenticateToken, rerollController);

/**
 * @swagger
 * paths:
 *   /idleType/addIdleType: 
 *     post:
 *       summary: "이상형 정보 추가"
 *       description: "사용자의 이상형 정보를 추가하는 API"
 *       tags:
 *         - idleType
 *       security:
 *         - BearerAuth: []
 *       requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 idle_MBTI:
 *                   type: string
 *                   example: "INTJ"
 *                   description: "이상형의 MBTI"
 *                 age_gap:
 *                   type: integer
 *                   example: 1
 *                   description: "연하=0, 동갑=1, 연상=2"
 *                 smoking_idle:
 *                   type: boolean
 *                   example: false
 *                   description: "담배 피는 유무"
 *                 drinking_idle:
 *                   type: integer
 *                   example: 1
 *                   description: "술 마시는 유무 (0,1,2)"
 *                 major_idle:
 *                   type: array
 *                   items:
 *                     type: string
 *                   example: ["스포츠건강관리전공", "가족복지학과", "컴퓨터과학전공"]
 *                   description: "이상형이 속한 학과"
 *       responses:
 *         200:
 *           description: "이상형 정보가 추가되었습니다."
 *         400:
 *           description: "필수 입력값이 누락되었습니다."
 *         401:
 *           description: "토큰이 없거나 로그인되지 않음."
 *         403:
 *           description: "토큰이 유효하지 않음."
 *         500:
 *           description: "서버 에러"
 */


/**
 * @swagger
 * /idleType/fixIdleType:
 *   patch:
 *     summary: 수정된 이상형 정보 저장
 *     description: 사용자의 이상형 정보를 수정합니다.
 *     security:
 *       - BearerAuth: []
 *     tags:
 *       - idleType
 *     requestBody:
 *       description: 수정할 이상형 정보
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               idle_MBTI:
 *                 type: string
 *                 description: 사용자의 MBTI 유형
 *                 example: "ENFP"
 *               age_gap:
 *                 type: integer
 *                 description: 이상형과의 나이 차이
 *               smoking_idle:
 *                 type: boolean
 *                 description: 흡연 여부
 *               drinking_idle:
 *                 type: integer
 *                 description: 음주 여부
 *               major_idle:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: 이상형의 전공 리스트
 *                 example: ["휴먼지능정보공학전공", "조형예술전공", "국가안보학과", "국어교육과"]
 *     responses:
 *       200:
 *         description: 이상형 정보가 성공적으로 수정되었습니다.
 *       400:
 *         description: 요청이 잘못되었습니다.
 *       401:
 *         description: 인증되지 않았습니다.
 *       403:
 *         description: 토큰이 유효하지 않습니다.
 */

/**
 * @swagger
 * /idleType/findIdleType:
 *   get:
 *     summary: "이상형 찾기"
 *     description: "사용자의 이상형을 랜덤으로 찾아 반환합니다."
 *     tags:
 *       - idleType
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: "이상형을 성공적으로 찾음"
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 result:
 *                   type: object
 *                   properties:
 *                     findUser:
 *                       type: object
 *                       properties:
 *                         userId:
 *                           type: integer
 *                         nickName:
 *                           type: string
 *                         isSmoking:
 *                           type: boolean
 *                         isDrinking:
 *                           type: integer
 *                         mbti:
 *                           type: string
 *                         major:
 *                           type: string
 *                         instagramId:
 *                           type: string
 *                         age:
 *                           type: integer
 *                 message:
 *                   type: string
 *                   example: "이상형을 찾았습니다!"
 *       401:
 *         description: "토큰이 없거나 유효하지 않음"
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "토큰이 없습니다."
 *       403:
 *         description: "토큰이 유효하지 않음"
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "토큰이 유효하지 않습니다."
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
 * /idleType/reroll:
 *   get:
 *     summary: 이상형 ReRoll 기능
 *     description: 사용자의 토큰을 검증하고, ReRoll 기능을 수행합니다.
 *     tags:
 *       - idleType
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: ReRoll 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 result:
 *                   type: integer
 *                   description: 남은 ReRoll 횟수
 *                 message:
 *                   type: string
 *                   example: "이상형을 찾았습니다!"
 *       401:
 *         description: 인증되지 않음 (토큰 없음 또는 로그인 안 됨)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "토큰이 없습니다."
 *       403:
 *         description: 유효하지 않은 토큰
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "토큰이 유효하지 않습니다."
 *       405:
 *         description: ReRoll 횟수 초과
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "ReRoll 횟수를 모두 소진하셨습니다."
 *       500:
 *         description: 서버 에러
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