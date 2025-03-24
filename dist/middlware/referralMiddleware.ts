import { getPool } from "../config/database/mysqlConnect";


// 추천인 코드 생성 6자리 문자 + 숫자 로직
export const generateReferralCode = async (
    user_id : number
):Promise<string> => {
    const chars = 'bT10Ve7WwkFuySxRoY9Kmd3ljNtOpnZD4APMG65CL8JsvUhIfHEgXcar2BqizQ';
    let code = '';
    
    for(let i = 0; i<6; i++) {
        code += chars.charAt(Math.floor(Math.random() * chars.length));
    }

    return  code;
};

export const checkRefferalCode = async(
    user_id : number,
    referralCode : string
):Promise<boolean> => {
    const pool = await getPool();

    console.log(user_id, referralCode);

    // 내 추천 코드 확인
    const check_my_referralCode = 
    `SELECT referralCode FROM user WHERE user_id = ?;`; // 내 referralCode 반환

    // 친구 추천 코드 확인
    const check_friend_referralCode =
    `SELECT user_id FROM user WHERE referralCode = ?;`; // 친구 user_id 반환

    const [checkMyReferralCode] : any = await pool.query(check_my_referralCode, [user_id]); // 내 referralCode 반환
    const [checkFriendReferralCode]: any = await pool.query(check_friend_referralCode, [referralCode]);   // 친구 user_id 반환    

    const friend_id = checkFriendReferralCode[0].user_id;
    const my_referralCode = checkMyReferralCode[0].referralCode;

    if(my_referralCode === referralCode) {
        return false; // 내 추천 코드를 넣은 놈이기 때문
    }

    if(!friend_id) {
        return false; // 존재하지 않는 추천 코드
    }

    if(friend_id === user_id) {
        return false; // 자기 자신의 추천 코드 넣었다는 얘기임
    }   
    return true;
};


export const increaseReferralCount = async(
    user_id : number,
    referralCode : string
):Promise<void> => {
    const pool = await getPool();

    const index_query = `SELECT user_id FROM user WHERE referralCode = ?`;
    const [index_check] : any = await pool.query(index_query, [referralCode]);
    const friend_id = index_check[0].user_id;

    const query_increase_friend = `UPDATE user
                                   SET reroll = reroll + 3 
                                   WHERE user_id = ?`;

    await pool.query(query_increase_friend, [friend_id]);

    const query_increase_me = `UPDATE user
                               SET reroll = reroll + 2
                               WHERE user_id = ?`;
                                       
    await pool.query(query_increase_me, [user_id]);


    const increase_referralIndex =
    `UPDATE user
     SET referralIndex = referralIndex + 1
     WHERE user_id = ?;`;

    await pool.query(increase_referralIndex, [user_id]);
    await pool.query(increase_referralIndex, [friend_id]); // 만약에 추천인 코드 입력이 한번만 되야한다면 이 경우는 지울 수 있을 듯
};


// 추천인 코드 입력은 가입 과정 이후에 입력을 하되 한 번만 가능해야하는 조건 함수
export const referralIndexCheck = async(
    user_id : number
): Promise<boolean> => {
    const pool = await getPool();

    const query = `SELECT referralIndex FROM user WHERE user_id = ?;`;  

    const [result] : any = await pool.query(query, [user_id]);

    const referralIndex = result[0].referralIndex;

    if(referralIndex > 0) {
        return false;
    }
    return true;
};