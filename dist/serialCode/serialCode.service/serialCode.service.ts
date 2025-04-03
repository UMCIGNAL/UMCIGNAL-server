import { insertCodeModel } from "../sericalCode.model/sericalCode.model";

export const insertCodeService = async (
    user_id : number,
    serialCode : String
):Promise<any> => {
    const result = await insertCodeModel(user_id, serialCode);

    return result;
}