import { Request, Response, NextFunction } from "express"

export const healthController = async (
    req : Request,
    res : Response,
    next : NextFunction
): Promise<any> => {
    try {
        return res.status(200).json({ message : 'health Checking : Server is running' });
    } catch (error) {
        console.log("error health check");      
        return res.status(500).json({messgae : "health Checking : Server Error"});
    }
};