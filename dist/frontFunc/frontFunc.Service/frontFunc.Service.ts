import { operationFrontModel } from "../frontFunc.Model/frontFunc.Model";


export const operationFrontService = async(
    user_id : number
):Promise<boolean> => {
    const result = await operationFrontModel(user_id);

    return result;
};