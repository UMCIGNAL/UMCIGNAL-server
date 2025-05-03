import { userInfoFront } from "../frontFunc.DTO/frontFunc.DTO";
import { operationFrontModel, signUpModel } from "../frontFunc.Model/frontFunc.Model";


export const operationFrontService = async(
    user_id : number
):Promise<boolean> => {
    const result = await operationFrontModel(user_id);

    return result;
};

export const signUpService = async (
    user_id : number,
    userInfo : userInfoFront
):Promise<boolean> => {
    const result = await signUpModel(user_id, userInfo);

    return result;
}