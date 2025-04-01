import Router from 'express';
import { searchController, specificMajorController } from './search.controller/search.controller';
import { authenticateToken } from '../security/JWT/auth.jwt';

const router = Router();

router.get('/', (req, res) => {
    res.json('search Router');
});

router.get('/major', authenticateToken, searchController);
router.get('/specificMajor', authenticateToken,specificMajorController);

/**
 * @swagger
 * /search/major:
 *   get:
 *     summary: "전공 검색 API"
 *     description: "전공 정보를 검색하는 API"
 *     tags:
 *      - search
 *     responses:
 *       200:
 *         description: "전공 검색 결과"
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 result:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                       name:
 *                         type: string
 *       500:
 *         description: "서버 에러"
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "서버 에러 입니다."
 */


/**
 * @swagger
 * /search/specificMajor:
 *   get:
 *     summary: 특정 전공 정보 조회
 *     description: college_id에 해당하는 전공 목록을 조회합니다.
 *     tags:
 *      - search
 *     parameters:
 *       - in: query
 *         name: majorId
 *         required: true
 *         schema:
 *           type: integer
 *         description: 조회할 전공의 college_id
 *     responses:
 *       200:
 *         description: 조회된 전공 목록
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 result:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       college_id:
 *                         type: integer
 *                         example: 1
 *                       college_name:
 *                         type: string
 *                         example: "인문사회과학대학"
 *       400:
 *         description: majorId가 없을 경우 발생하는 오류
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "전공 id를 입력해주세요."
 *       500:
 *         description: 서버 오류
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