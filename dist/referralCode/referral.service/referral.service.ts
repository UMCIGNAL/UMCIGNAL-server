import { findReferralModel, getMyRefferalModel } from "../referral.model/referral.model";


export const findReferralService = async(
    user_id : number,
    referralCode : string
):Promise<string> => {
    const result = await findReferralModel(user_id, referralCode);

    return result;
}

export const getMyRefferalService = async(
    user_id : number
):Promise<string> => {
    const result = await getMyRefferalModel(user_id);

    return result;
};