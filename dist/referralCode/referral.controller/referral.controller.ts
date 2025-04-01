import { Request, Response, NextFunction } from 'express';
import { decodeTokenUserId } from '../../security/JWT/auth.jwt';
import { findReferralService, getMyRefferalService } from '../referral.service/referral.service';
import { check_token } from '../../middlware/softDelete';

export const findReferralController = async (
    req : Request,
    res : Response,
    next : NextFunction
):Promise<any> => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        const referralCode = req.body.referralCode as string;

        if(!token) {
            return res.status(404).json({message: '토큰이 없습니다.'});
        }

        if(!referralCode) {
            return res.status(404).json({message: '추천 코드가 없습니다.'});
        }
        
        const user_id = decodeTokenUserId(token) as number;

        const check = await check_token(user_id);

        if(check === false) {
            return res.status(401).json({ message: '로그인 되어있지 않습니다.' });
        } else if(check === true) {
            const result = await findReferralService(user_id, referralCode);

            if(result.length > 6) {
                return res.status(409).json({ result });
            }

            return res.status(203).json({ result , message : '추천인 코드가 적용되었습니다.'});
        }

    } catch (error : any) {
        console.log(error);
        return res.status(500).json({message: '서버 에러입니다.'});
    }
};

export const getMyReferralCodeController = async(
    req : Request,
    res : Response,
    next : NextFunction
):Promise<any> => {
    const token = req.headers.authorization?.split(' ')[1];
    const user_id = decodeTokenUserId(token as string) as number;

    if(!token) {
        return res.status(404).json({message: '토큰이 없습니다.'}); 
    } 

    const check = await check_token(user_id);
    
    if(check === false) {
        return res.status(401).json({ message: '로그인 되어있지 않습니다.' });
    } else if(check === true) {
        const result = await getMyRefferalService(user_id);  

        if(!result) {
            return res.status(404).json({ message : '추천 코드가 없습니다.' });
        }

        return res.status(202).json({ message : "추천인 코드는 ", result });
    }
};