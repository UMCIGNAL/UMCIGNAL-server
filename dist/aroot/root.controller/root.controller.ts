import { Request, Response, NextFunction } from "express";
import { decodeTokenUserId } from "../../security/JWT/auth.jwt";
import { check_token } from "../../middlware/softDelete";
import { getRerollCountService } from "../root.service/root.service";


export const getRerollCountController = async (
    req : Request,
    res : Response,
    next : NextFunction
):Promise<any> => {
    try {
        const token = req.headers.authorization?.split(' ')[1];

        if(!token) {
            return res.status(404).json({ message: '토큰이 없습니다.' });
        }

        const user_id = decodeTokenUserId(token) as number;
                
        if(user_id === null) {
            return res.status(401).json({ message: '토큰이 유효하지 않습니다.' });
        }

        const check = await check_token(user_id);
                
        if(check === false) {
            return res.status(401).json({ message: '로그인 되어있지 않습니다.' });
        } else if(check === true) {
            await getRerollCountService(user_id);
            return res.status(200).json({ message: 'reroll count가 회복되었습니다. +1' });
        }

    } catch (error : any) {
        return res.status(500).json({ message : '서버 에러입니다.' });
    }
};