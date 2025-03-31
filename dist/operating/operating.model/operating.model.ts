import { checkIdleTypeInsert, checkSignUpInsert } from "../../middlware/operating.middleware";

export const checkSignUpModel = async (
    user_id : number
):Promise<boolean> => {
    const result = await checkSignUpInsert(user_id);

    return result;
};

export const checkIdleInsertModel = async (
    user_id : number
):Promise<boolean> => {
    const result = await checkIdleTypeInsert(user_id);

    return result;
};