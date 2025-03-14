import Router from 'express';
import { searchController } from './search.controller/search.controller';

const router = Router();

router.get('/', (req, res) => {
    res.json('search Router');
});

router.get('/major', searchController);

/**
 * @swagger
 * /search/major:
 *   get:
 *     summary: "전공 검색"
 *     description: "입력한 키워드가 포함된 전공 목록을 조회합니다."
 *     tags:
 *       - Major
 *     parameters:
 *       - in: query
 *         name: keyword
 *         required: true
 *         description: "검색할 키워드 (예: '컴')"
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: "검색 결과 반환"
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 result:
 *                   type: array
 *                   items:
 *                     type: string
 *       400:
 *         description: "잘못된 요청 (검색어 없음)"
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       500:
 *         description: "서버 에러"
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 */
router.get('/major', searchController);


export default router;