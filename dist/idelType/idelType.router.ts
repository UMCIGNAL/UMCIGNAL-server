import Router from 'express';
import { addIdleTypeController } from './idleType.controller/idleType.controller';
import { authenticateToken } from '../security/JWT/auth.jwt';

const router = Router();

router.get('/', (req, res) => {
    res.json('idleType Router');
});

router.post('/addIdleType', authenticateToken, addIdleTypeController);

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


export default router;