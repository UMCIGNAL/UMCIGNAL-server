import { Request, Response, NextFunction } from "express";
import { errorMessage, frontError, frontSuccess, successMessage } from "../frontFunc.Error/frontFunc.errorHandler";
import { decodeTokenUserId } from "../../security/JWT/auth.jwt";
import { frontRerollSerivce, operationFrontService, signUpService } from "../frontFunc.Service/frontFunc.Service";
import { idealInfo, userInfoFront } from "../frontFunc.DTO/frontFunc.DTO";

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
        if(!userInfo.instagram_id) missingFields.push("instagram_id");

        if(missingFields.length > 0) {
            res.status(frontError.missingField.statusCode).json(frontError.missingField);
            return;
        }

        const result = await signUpService(user_id, userInfo);

        if(!result) {
            res.status(frontError.signUpFaild.statusCode).json(frontError.signUpFaild);
            return;
        }
        
        res.status(frontSuccess.singUpSuccess.statusCode).json(frontSuccess.singUpSuccess);
        return;
    } catch (error : any) {
        res.status(frontError.serverError.statusCode).json(frontError.serverError);
        return;
    }
};

export const frontRerollController = async (
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

        console.log("Reroll Controller");
        const result = await frontRerollSerivce(user_id);

        if(result === 0) {
            res.status(frontError.rerollCount.statusCode).json(frontError.rerollCount);
            return;
        } else if(result === null) {
            res.status(frontError.notFoundIdeal.statusCode).json(frontError.notFoundIdeal);
            return;
        }

        const instagram_id = (result as {findUser: idealInfo}).findUser.instagram_id;

        console.log("Return Reroll Controller");
        res.status(frontSuccess.matchSuccess.statusCode).json({
            ...frontSuccess.matchSuccess,
            instagram_id: instagram_id
        });
        return;
    } catch (error : any) {
        res.status(frontError.serverError.statusCode).json(frontError.serverError);
        return;
    }
};