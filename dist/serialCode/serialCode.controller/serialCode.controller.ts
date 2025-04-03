import { Request, Response, NextFunction } from "express"
import { decodeTokenUserId } from "../../security/JWT/auth.jwt";
import { check_token } from "../../middlware/softDelete";
import { insertCodeService } from "../serialCode.service/serialCode.service";

export const insertCodeController = async (
    req : Request,
    res : Response,
    next : NextFunction
):Promise<any> => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        const serialCode = req.body.serialCode;

        if(!token) {
            return res.status(404).json({ message: '토큰이 없습니다.' });
        }

        if(!serialCode) {
            return res.status(404).json({ message : '코드를 입력해주세요.' });
        }
                
        const user_id = decodeTokenUserId(token) as number;
                
        if(user_id === null) {
            return res.status(401).json({ message: '토큰이 유효하지 않습니다.' });
        }
        
        const check = await check_token(user_id);
                
        if(check === false) {
            return res.status(401).json({ message: '로그인 되어있지 않습니다.' });
        } else if(check === true) {            
            const result = await insertCodeService(user_id, serialCode);
        
            if(result === 0) {
                return res.status(404).json({ message : '존재하지 않는 코드입니다.' });
            }

            return res.status(202).json({ result, message : '코드가 정상적으로 추가되었습니다.' });
        }

    } catch (error : any) {
        return res.status(500).json({ message : '서버 에러입니다.'});
    }
}