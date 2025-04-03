import { insertCodeModel, myRerollModel } from "../sericalCode.model/sericalCode.model";

export const insertCodeService = async (
    user_id : number,
    serialCode : String
):Promise<any> => {
    const result = await insertCodeModel(user_id, serialCode);

    return result;
}

export const myRerollService = async (
    user_id : number
):Promise<number> => {
    const result = await myRerollModel(user_id);

    return result;
};