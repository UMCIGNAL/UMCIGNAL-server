import { Request, Response, NextFunction } from "express";
import { errorMessage, frontError, frontSuccess, successMessage } from "../frontFunc.Error/frontFunc.errorHandler";
import { decodeTokenUserId } from "../../security/JWT/auth.jwt";
import { operationFrontService } from "../frontFunc.Service/frontFunc.Service";

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
        }

        res.status(frontSuccess.singUpSuccess.statusCode).json(frontSuccess.singUpSuccess);
    } catch (error: any) {
        res.status(frontError.serverError.statusCode).json(frontError.serverError);
    }
};