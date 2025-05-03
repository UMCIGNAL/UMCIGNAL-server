import { getPool } from "../../config/database/mysqlConnect";
import { checkRefferalCode, increaseReferralCount, referralIndexCheck } from "../../middlware/referralMiddleware";

export const findReferralModel = async(
    user_id : number,
    referralCode : string
):Promise<string> => {
    const pool = await getPool();

    const check = await checkRefferalCode(user_id, referralCode);

    if(check === 2) {
        return '존재하지 않는 추천인 코드입니다.';
    } else if (check === 3) {
        return '자기 자신의 추천인 코드입니다.';
    } else { 
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