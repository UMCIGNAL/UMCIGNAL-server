import { getPool } from "../../config/database/mysqlConnect";
import { frontReroll } from "../../middlware/frontFunc.middleware";
import { defineGender } from "../../middlware/idleType.middleware";
import { generateReferralCode } from "../../middlware/referralMiddleware";
import { idealInfo, userInfoFront } from "../frontFunc.DTO/frontFunc.DTO";

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

        const current_ins_id = userInfo.instagram_id;

        const check_At = current_ins_id.substring(0,1);

        if(check_At === '@') {
            userInfo.instagram_id = current_ins_id.substring(1, current_ins_id.length);
        }


        const query = `UPDATE user
                       SET gender = ?,
                           instagram_id = ?,
                           referralCode = ?,
                           signUpComplete = ?
                        WHERE user_id = ?
                        `;
    
        const [run_query]:any = await pool.query(query, [
            userInfo.gender, 
            userInfo.instagram_id,
            referral_code,
            true,
            user_id
        ]);

        return true;
    } catch (error : any) {
        console.log(error);
        return false;
    }
};

export const frontRerollModel = async (
    user_id : number
):Promise<{findUser: idealInfo} | boolean | null | number> => {
    console.log("Reroll Model");
    const pool = await getPool();
    const conn = await pool.getConnection();

    try {
        await conn.beginTransaction();

        const gender = await defineGender(user_id, conn);

        const result = await frontReroll(gender, user_id, conn);

        if (!result && result !== 0) {
            await conn.rollback();
            return null;        
        } else if(result === 0) {
            await conn.rollback();
            return 0;
        }

        await conn.commit();

        return result;
    }catch (error) {
        return false;
    }
};