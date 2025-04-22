import { Request, Response, NextFunction } from 'express';
import { emailValidation, gmailValidation } from '../../security/validation/validation';
import { changeUserInfoService, getMyInstService, mailVerifyService, sendMailCodeService, userLogOutService, userSignOutService, userSignupService } from '../user.service/user.service';
import { userChangeInfoDTO, UserDto } from '../user.dto/user.dto';
import { decodeTokenUserId } from '../../security/JWT/auth.jwt';
import { check_token, come_back_user } from '../../middlware/softDelete';


export const sendMailCodeController = async (
    req : Request,
    res : Response,
    next : NextFunction
) : Promise<any> => {
    try {
        const mail = req.body.mail as string;

        // 상명대 이메일 형식 검증 && gmail 이메일 형식 검증
        if(!emailValidation(mail) && !gmailValidation(mail)) {
           return res.status(403).json({ message: '이메일 형식이 올바르지 않습니다.' });
        }

        
        if(mail.split('@')[0] === 'test') {
            return res.status(200).json({ message: '메일 전송 완료' });
        }
        
        const result = await sendMailCodeService(mail);
        
        // 이미 가입된 경우 예외처리 (토큰이 만료됬을 경우 즉 이메일 재 전송 요함) || 신규 회원도 메일 전송
        if(result === 0) {
            return res.status(201).json({ message: '기존 회원 복구 및 인증코드를 재전송하였습니다.' });
        }

        return res.status(200).json({  userId : result, message: '메일 전송 완료' });
    } catch (error : any) {
        console.log(error);
        return error;
    }
};


export const mailVerifyController = async (
    req : Request,
    res : Response,
    next : NextFunction
): Promise<any> => {
    try {
        const mailVerification = req.body.mailVerification as string;

        if (!mailVerification) {
            return res.status(401).json({ message: '인증 코드가 제공되지 않았습니다.' });
        }

        // 이메일 인증 코드 검증
        if(mailVerification.length !== 6) {
            return res.status(408).json({ message: '인증 코드는 6자리입니다.' });
        }

        const token = await mailVerifyService(mailVerification);

        if(!token) {
            return res.status(403).json({ message: '인증 코드가 올바르지 않습니다. 다시 인증해주세요.' });
        }

        return res.status(200).json({ 
            message: '메일 인증 완료', 
            token: token 
        });
    } catch (error : any) {
        console.error(error);
        return res.status(500).json({ message: '서버 오류가 발생했습니다.' });
    }
};


export const userSignupController = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<any> => {  // 반환 타입을 Promise<void>로 설정
    try {
        const info: UserDto = req.body;
        const token = req.headers.authorization?.split(' ')[1];
    
        const user_id = decodeTokenUserId(token) as number;

        if(user_id === null) {
            return res.status(401).json({ message: '토큰이 유효하지 않습니다.' });
        }

        // 필수 값 검증
        const missingFields: string[] = [];

        if (!info.gender) missingFields.push("gender");
        if (!info.age) missingFields.push("age");
        if (!info.student_major) missingFields.push("student_major");
        if (!info.MBTI) missingFields.push("MBTI");
        if (info.is_smoking === undefined) missingFields.push("is_smoking");
        if (info.is_drinking === undefined) missingFields.push("is_drinking");
        if (!info.instagram_id) missingFields.push("instagram_id");
        if (!info.age) missingFields.push("age");

        // 누락된 필드가 있으면 400 응답
        if (missingFields.length > 0) {
            return res.status(402).json({
                message: "필수 입력값이 누락되었습니다.",
                missingFields
            });
        }

        // 서비스 호출
        const result = await userSignupService(info, user_id);

        return res.status(200).json({
            message: "회원가입 성공",
            data: result
        });

    } catch (error: any) {
        console.error(error);
        next(error);  // Express 에러 핸들러로 전달
    }
};


export const userLogOutController = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<any> => {
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
            await userLogOutService(token);
            return res.status(200).json({ message: '로그아웃 성공' });
        }
    }catch(error: any) {
        console.error(error);
        next(error);
    }
};


export const userSignOutController = async(
    req: Request,
    res: Response,
    next: NextFunction
): Promise<any> => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        const user_id = decodeTokenUserId(token) as number;

        if(!token) {
            return res.status(404).json({ message: '토큰이 없습니다.' });
        }

        if(user_id === null) {
            return res.status(401).json({ message: '토큰이 유효하지 않습니다.' });
        }

        const check = await check_token(user_id);
        

        if(check === false) {
            return res.status(401).json({ message: '로그인 되어있지 않습니다.' });
        } else if(check === true) {
            await userSignOutService(user_id);
            return res.status(200).json({ message: '회원탈퇴 성공 5일 뒤에 데이터가 삭제됩니다.' });
        }
    }catch(error: any) {
        console.error(error);
        next(error);
    }
};

export const userWhoCameBackController = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<any> => {
    try {
        const email = req.body.email as string;

        const student_id = email.split('@')[0];

        const check = await come_back_user(student_id);

        if(check) {
            const result = await sendMailCodeService(email);
            return res.status(200).json({ userId: result, message: '메일 전송 완료' }); // 다시 검증 라우터로 이동
        } else {
            return res.status(400).json({ message: '탈퇴한 회원이 아닙니다.' });
        }

    }catch(error: any) {
        console.error(error);
        next(error);
    }
};



export const changeUserInfoController = async (
    req : Request,
    res : Response,
    next : NextFunction
):Promise<any> => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        const user_id = decodeTokenUserId(token) as number;
        const userInfo : userChangeInfoDTO = req.body;

        if(!token) {
            return res.status(404).json({ message: '토큰이 없습니다.' });
        }

        const check = await check_token(user_id);
        
        if(check === false) {
            return res.status(401).json({ message: '로그인 되어있지 않습니다.' });
        } else if(check === true) {

            const missingFields: string[] = [];

            if (!userInfo.MBTI) missingFields.push("MBTI");
            if (userInfo.is_smoking === undefined) missingFields.push("is_smoking");
            if (userInfo.is_drinking === undefined) missingFields.push("is_drinking");
            if (!userInfo.instagram_id) missingFields.push("instagram_id");

            // 누락된 필드가 있으면 400 응답
            if (missingFields.length > 0) {
                return res.status(402).json({
                    message: "필수 입력값이 누락되었습니다.",
                    missingFields
                });
            }


            await changeUserInfoService(user_id, userInfo);
            return res.status(200).json({ message: '회원 정보가 변경이 완료되었습니다.' });
        }

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: '서버 오류가 발생했습니다.' });
    }
};

export const getMyInstController = async (
    req : Request,
    res : Response,
    next : NextFunction
):Promise<any> => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        const user_id = decodeTokenUserId(token) as number;

        if(!token) {
            return res.status(404).json({ message: '토큰이 없습니다.' });
        }

        if(user_id === null) {
            return res.status(401).json({ message: '토큰이 유효하지 않습니다.' });
        }

        const check = await check_token(user_id);
        

        if(check === false) {
            return res.status(401).json({ message: '로그인 되어있지 않습니다.' });
        } else if(check === true) {
            const result = await getMyInstService(user_id);
            return res.status(200).json({ result });
        }
    }catch(error: any) {
        next(error);
    }
};