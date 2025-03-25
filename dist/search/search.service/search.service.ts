import { majorDTO } from "../search.dto/search.dto";
import { searchModel, specificMajorModel } from "../search.model/search.model";

export const searchService = async (
):Promise<string[]> => {
    const result = searchModel();

    return result;
}

export const specificMajorService = async (
    major_id : number
):Promise<majorDTO[]> => {
    const result = await specificMajorModel(major_id);

    return result;
}