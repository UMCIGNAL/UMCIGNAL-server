import Router from 'express';
import { searchController, specificMajorController } from './search.controller/search.controller';

const router = Router();

router.get('/', (req, res) => {
    res.json('search Router');
});

router.get('/major', searchController);
router.get('/specificMajor', specificMajorController);

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
 */

export default router;