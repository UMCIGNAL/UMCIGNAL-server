import { Request, Response, NextFunction } from "express";
import { searchService } from "../search.service/search.service";

export const searchController = async (
    req : Request,
    res : Response,
    next : NextFunction
): Promise<any> => {
    try {
        let keyword = req.query.keyword as string;

        if (!keyword) {
            return res.status(400).json({ message: "검색어를 입력해주세요." });
        }

        const result = await searchService(keyword);

        return res.status(200).json({ result });

    } catch (error) {
        console.log(error);
        throw res.status(500).json({ message: "서버 에러 입니다." });
    }
};