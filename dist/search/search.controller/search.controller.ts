import { Request, Response, NextFunction } from "express";
import { searchService } from "../search.service/search.service";

export const searchController = async (
    req : Request,
    res : Response,
    next : NextFunction
): Promise<any> => {
    try {
        const result = await searchService();

        return res.status(200).json({ result });
    } catch (error) {
        console.log(error);
        throw res.status(500).json({ message: "서버 에러 입니다." });
    }
};

export const specificMajorController = async (
    req : Request,
    res : Response,
    next : NextFunction
):Promise<void> => {
    try {

    } catch (error : any) {

    }
};