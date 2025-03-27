import { getPool } from "../../config/database/mysqlConnect";
import { checkRefferalCode, increaseReferralCount, referralIndexCheck } from "../../middlware/referralMiddleware";

export const findReferralModel = async(
    user_id : number,
    referralCode : string
):Promise<string> => {
    const pool = await getPool();

    const check = await checkRefferalCode(user_id, referralCode);

    if(check === false) {
        return '추천 코드가 올바르지 않습니다.';
    } else { 
        // 추천인 코드가 한번만 가능하다면 이 함수를 추가할 것
             
        const duplicationCheck = await referralIndexCheck(user_id);

        if(duplicationCheck === false) {
            return '이미 추천인 코드를 사용하셨습니다.';
        }

        await increaseReferralCount(user_id, referralCode);

        return referralCode;
    }
};


export const getMyRefferalModel = async(
    user_id : number
):Promise<string> => {
    const pool = await getPool();

    const query = 
    `SELECT referralCode FROM user WHERE user_id = ?`;

    const [result] : any = await pool.query(query, [user_id]);

    const referralCode = result[0].referralCode;

    return referralCode;
};