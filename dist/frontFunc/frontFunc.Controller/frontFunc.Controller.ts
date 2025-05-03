import { Request, Response, NextFunction } from "express";
import { errorMessage, frontError, frontSuccess, successMessage } from "../frontFunc.Error/frontFunc.errorHandler";
import { decodeTokenUserId } from "../../security/JWT/auth.jwt";
import { operationFrontService, signUpService } from "../frontFunc.Service/frontFunc.Service";
import { userInfoFront } from "../frontFunc.DTO/frontFunc.DTO";

export const operationFrontController = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const token = req.headers.authorization?.split(' ')[1];

        if(!token) {
            res.status(frontError.unAuthorized.statusCode).json(frontError.unAuthorized);
            return;
        }

        const user_id = decodeTokenUserId(token) as number;

        if(!user_id) {
            res.status(frontError.forbidden.statusCode).json(frontError.forbidden);
            return;
        }

        const result = await operationFrontService(user_id);

        if(!result) {
            res.status(frontError.notSignUp.statusCode).json(frontError.notSignUp);
            return;
        }

        res.status(frontSuccess.operationSuccess.statusCode).json(frontSuccess.operationSuccess);
        return;
    } catch (error: any) {
        res.status(frontError.serverError.statusCode).json(frontError.serverError);
        return;
    }
};

export const signUpController = async (
    req : Request,
    res : Response,
    next : NextFunction
):Promise<void> => {
    try {   
        const token = req.headers.authorization?.split(' ')[1];

        if(!token) {
            res.status(frontError.unAuthorized.statusCode).json(frontError.unAuthorized);
            return;
        }

        const user_id = decodeTokenUserId(token) as number;

        if(!user_id) {
            res.status(frontError.forbidden.statusCode).json(frontError.forbidden);
            return;
        }

        const userInfo : userInfoFront = req.body;

        const missingFields: string[] = [];
        if(!userInfo.gender) missingFields.push("gender");
        if(!userInfo.instagram) missingFields.push("instagram_id");
        if(!userInfo.major) missingFields.push("major");
        if(userInfo.sameMajor === undefined) missingFields.push("sameMajor");

        if(missingFields.length > 0) {
            res.status(frontError.missingField.statusCode).json(frontError.missingField);
            return;
        }

        const result = await signUpService(user_id, userInfo);

        if(!result) {
            res.status(frontError.signUpFaild.statusCode).json(frontError.signUpFaild);
            return;
        }
        
        res.status(frontSuccess.singUpSuccess.statusCode).json(frontSuccess.signUpComplete);
        return;
    } catch (error : any) {
        res.status(frontError.serverError.statusCode).json(frontError.serverError);
        return;
    }
};

