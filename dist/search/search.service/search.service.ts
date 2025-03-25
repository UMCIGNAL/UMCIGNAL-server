import { searchModel } from "../search.model/search.model";

export const searchService = async (
):Promise<string[]> => {
    const result = searchModel();

    return result;
}