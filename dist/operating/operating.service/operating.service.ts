import { checkIdleInsertModel, checkSignUpModel } from "../operating.model/operating.model";


export const checkSignUpService = async (
    user_id : number
): Promise<boolean> => {
    const result = await checkSignUpModel(user_id);

    return result;
};

export const checkIdleInsertService = async (
    user_id : number
): Promise<boolean> => {
    const result = await checkIdleInsertModel(user_id);

    return result;
};