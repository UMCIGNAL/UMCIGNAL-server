import { Request, Response, NextFunction } from 'express';
import { emailValidation, gmailValidation } from '../../security/validation/validation';
import { mailVerifyService, sendMailCodeService, userSignupService } from '../user.service/user.service';
import { UserDto } from '../user.dto/user.dto';
import { decodeTokenUserId } from '../../security/JWT/auth.jwt';


export const sendMailCodeController = async (
    req : Request,
    res : Response,
    next : NextFunction
) : Promise<any> => {
    try {
        const mail = req.body.mail as string;

        // 상명대 이메일 형식 검증 && gmail 이메일 형식 검증
        if(!emailValidation(mail) && !gmailValidation(mail)) {
           return res.status(400).json({ message: '이메일 형식이 올바르지 않습니다.' });
        }

        // 이미 가입된 경우 예외처리 (토큰이 만료됬을 경우 즉 이메일 재 전송 요함) || 신규 회원도 메일 전송
        const result = await sendMailCodeService(mail);


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
            return res.status(400).json({ message: '인증 코드가 제공되지 않았습니다.' });
        }

        // 이메일 인증 코드 검증
        if(mailVerification.length !== 6) {
            return res.status(400).json({ message: '인증 코드는 6자리입니다.' });
        }

        const token = await mailVerifyService(mailVerification);

        if(!token) {
            return res.status(400).json({ message: '인증 코드가 올바르지 않습니다. 다시 인증해주세요.' });
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
        const token = req.headers.authorization?.split(' ')[0];
        const user_id = decodeTokenUserId(token) as number;

        // 필수 값 검증
        const missingFields: string[] = [];

        if (!info.gender) missingFields.push("gender");
        if (!info.student_major) missingFields.push("student_major");
        if (!info.MBTI) missingFields.push("MBTI");
        if (info.is_smoking === undefined) missingFields.push("is_smoking");
        if (info.is_drinking === undefined) missingFields.push("is_drinking");
        if (!info.instagram_id) missingFields.push("instagram_id");

        // 누락된 필드가 있으면 400 응답
        if (missingFields.length > 0) {
            return res.status(400).json({
                message: "필수 입력값이 누락되었습니다.",
                missingFields
            });
        }

        // 서비스 호출
        const result = await userSignupService(info, user_id);

        return res.status(201).json({
            message: "회원가입 성공",
            data: result
        });

    } catch (error: any) {
        console.error(error);
        next(error);  // Express 에러 핸들러로 전달
    }
};
