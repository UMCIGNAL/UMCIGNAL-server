import { searchModel } from "../search.model/search.model";

export const searchService = async (
    keyword : string
):Promise<string[]> => {
    const result = searchModel(keyword);

    return result;
}