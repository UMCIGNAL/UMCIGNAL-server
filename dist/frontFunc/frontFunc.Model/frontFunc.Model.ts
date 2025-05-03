import { getPool } from "../../config/database/mysqlConnect";
import { generateReferralCode } from "../../middlware/referralMiddleware";
import { userInfoFront } from "../frontFunc.DTO/frontFunc.DTO";

export const operationFrontModel = async(
    user_id : number
):Promise<boolean> => {
    const pool = await getPool();

    const query = `SELECT signUpComplete FROM user WHERE user_id = ?`;

    const [query_result]:any = await pool.query(query, [user_id]);

    const result = query_result[0].signUpComplete;

    if(result === 1) {
        return true;
    } 
    return false;
};


export const signUpModel = async (
    user_id : number,
    userInfo : userInfoFront
): Promise<boolean> => {
    const pool = await getPool();

    try {
        const referral_code = await generateReferralCode(user_id);
    
        const query = `UPDATE user
                       SET gender = ?,
                           student_major = ?,
                           sameMajor = ?,
                           instagram_id = ?,
                           referralCode = ?,
                           signUpComplete = ?
                        WHERE user_id = ?
                        `;
    
        const [run_query]:any = await pool.query(query, [
            userInfo.gender, 
            userInfo.major,
            userInfo.sameMajor,
            userInfo.instagram,
            referral_code,
            true,
            userInfo
        ]);

        return true;
    } catch {
        return false;
    }
};