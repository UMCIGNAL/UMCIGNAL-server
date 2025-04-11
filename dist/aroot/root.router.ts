import Router from "express";
import { getRerollCountController } from "./root.controller/root.controller";

const router = Router();

router.patch('/getRorollCount', getRerollCountController);

/**
 * @swagger
 * /root/getRorollCount:
 *   patch:
 *     summary: "Reroll count를 회복 관리자의 특권"
 *     description: "사용자의 reroll count를 회복하고, 성공 메시지를 반환합니다."
 *     operationId: "getRerollCount"
 *     tags:
 *       - A 관리자의 특권
 *     responses:
 *       200:
 *         description: "Reroll count가 회복되었습니다."
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "reroll count가 회복되었습니다. +1"
 *       401:
 *         description: "로그인되지 않았거나 유효하지 않은 경우"
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example:
 *                     - "토큰이 유효하지 않습니다."
 *                     - "로그인 되어있지 않습니다."
 *       404:
 *         description: "Authorization 헤더가 누락된 경우"
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "토큰이 없습니다."
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


export default router;