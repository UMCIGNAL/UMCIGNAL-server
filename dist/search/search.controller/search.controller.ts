import { Request, Response, NextFunction } from "express";
import { searchService, specificMajorService } from "../search.service/search.service";
import { majorDTO } from "../search.dto/search.dto";

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
    req: Request,
    res: Response,
    next: NextFunction
): Promise<any> => {
    try {   
        const major_id = Number(req.query.majorId);

        if (!major_id) {
            return res.status(400).json({ message: "전공 id를 입력해주세요." });
        }

        const result: majorDTO[] = await specificMajorService(major_id);

        return res.status(200).json({ result });
    } catch (error) {
        console.error("Error in specificMajorController:", error);
        return res.status(500).json({ message: "서버 에러입니다." });
    }
};