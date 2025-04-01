import { Router } from 'express';
import { getCode } from '../middlware/serialCode.middleware';

const router = Router();

// router.get('/getCode', getCode);

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

export default router;