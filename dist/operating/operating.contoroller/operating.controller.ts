import { Request, Response, NextFunction } from 'express';
import { decodeTokenUserId } from '../../security/JWT/auth.jwt';
import { check_token } from '../../middlware/softDelete';
import { checkIdleInsertService, checkSignUpService } from '../operating.service/operating.service';


export const checkSignUpController = async (
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
            return res.status(401).json({ message : '토큰이 유효하지 않습니다. '});
        }
    
        const check = await check_token(user_id);
    
        if(check === false) {
            return res.status(401).json({ message: '로그인 되어있지 않습니다.' });
        } else if(check === true) {
            const result_signUp = await checkSignUpService(user_id);
            let result_idle;
            result_idle = false;

            if(result_signUp === false) {
                return res.status(403).json({ signUpStatus : result_signUp , idleTypeStatus : result_idle, message : '회원가입을 하지 않은 유저입니다.'});    
            } else {
                result_idle = await checkIdleInsertService(user_id);

                if(result_idle === false) {
                    return res.status(403).json({ 
                        signUpStatus: result_signUp, 
                        idleTypeStatus : result_idle,
                        message: '회원가입은 했지만 이상형 정보를 입력하지 않았습니다.' 
                      });
                }
            }

            return res.status(200).json({ signUpStatus : result_signUp , idleTypeStatus : result_idle, message : '회원가입과 이상형 정보를 모두 넣은 유저입니다.'});
        }
    } catch (error : any) {
        console.log(error);
        return res.status(500).json({ messgae : '서버 오류가 발생했습니다. '});
    }
};