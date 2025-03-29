import { Request, Response, NextFunction } from "express";
import { decodeTokenUserId } from "../../security/JWT/auth.jwt";
import { check_token } from "../../middlware/softDelete";
import { addIdleType, fixIdleType } from "../idleType.dto/idleType.dto";
import { addIdleTypeService, findIdleTypeService, fixIdleTypeService } from "../idleType.service/idleType.service";

export const addIdleTypeController = async (
    req : Request,
    res : Response,
    next : NextFunction
):Promise<any> => {
    try {
        const token = req.headers.authorization?.split(' ')[1];

        if(!token) {
            return res.status(401).json({ message: '토큰이 없습니다.' });
        }
        
        const user_id = decodeTokenUserId(token) as number;
        
        if(user_id === null) {
            return res.status(403).json({ message: '토큰이 유효하지 않습니다.' });
        }

        const check = await check_token(user_id);
        const idleType : addIdleType = req.body;
        
        if(check === false) {
            return res.status(401).json({ message: '로그인 되어있지 않습니다.' });
        } else if(check === true) {
            const missingFields: string[] = [];
            
            if (!idleType.idle_MBTI) missingFields.push("MBTI");
            if (!idleType.age_gap) missingFields.push("age_gap");
            if (idleType.smoking_idle === undefined) missingFields.push("smoking_idle");
            if (idleType.drinking_idle === undefined) missingFields.push("drinking_idle");
            if (!(idleType.major_idle.length > 0)) missingFields.push("major_idle");
            
            if (missingFields.length > 0) {
                return res.status(400).json({
                    message: "필수 입력값이 누락되었습니다.",
                    missingFields
                });
            }
            
            
            await addIdleTypeService(user_id, idleType);
            return res.status(200).json({ message: '이상형 정보가 추가되었습니다.' });
        }
    }catch(error : any) {
        console.log(error);
        return res.status(500).json({ message: "서버 에러입니다."})
    }   
};


export const fixIdleTypeController = async(
    req : Request,
    res : Response,
    next : NextFunction
): Promise<any> => {
    try {
        const token = req.headers.authorization?.split(' ')[1];

        if(!token) {
            return res.status(401).json({ message: '토큰이 없습니다.' });
        }
        
        const user_id = decodeTokenUserId(token) as number;
        
        if(user_id === null) {
            return res.status(403).json({ message: '토큰이 유효하지 않습니다.' });
        }

        const check = await check_token(user_id);
        const idleType : fixIdleType = req.body;
        
        if(check === false) {
            return res.status(401).json({ message: '로그인 되어있지 않습니다.' });
        } else if(check === true) {            
            await fixIdleTypeService(user_id, idleType);
            return res.status(200).json({ message: '이상형 정보가 추가되었습니다.' });
        }
    } catch (error) {
        return res.status(500).json({ message : '서버 에러입니다.' });
    }
};


export const findIdleTypeController = async (
    req : Request,
    res : Response,
    next: NextFunction
):Promise<any> => {
    try {
        const token = req.headers.authorization?.split(' ')[1];

        if(!token) {
            return res.status(401).json({ message: '토큰이 없습니다.' });
        }
        
        const user_id = decodeTokenUserId(token) as number;
        
        if(user_id === null) {
            return res.status(403).json({ message: '토큰이 유효하지 않습니다.' });
        }

        const check = await check_token(user_id);
        
        if(check === false) {
            return res.status(401).json({ message: '로그인 되어있지 않습니다.' });
        } else if(check === true) {            
            const result = await findIdleTypeService(user_id);
            return res.status(200).json({ result, message : '이상형을 찾았습니다!' });
        }        
    } catch(error) {
        return res.status(500).json({ message : '서버 에러입니다.' });
    }
};