import { getPool } from "../config/database/mysqlConnect";

export const checkSignUpInsert = async (
    user_id : number
): Promise<boolean> => {
    const pool = await getPool();

    const query = `SELECT signUpComplete FROM user WHERE user_id = ?;`;

    const [result] : any = await pool.query(query, [user_id]);

    const checking = result[0].signUpComplete;


    // 이미 초기 유저 정보를 전부 입력한 거임
    if(checking === 1) {
        return true;
    }

    return false;
};

export const checkIdleTypeInsert = async (
    user_id : number
): Promise<boolean> => {
    const pool = await getPool();

    const query = `SELECT idleComplete FROM user WHERE user_id =?;`;

    const [result] : any = await pool.query(query, [user_id]);

    const checking = result[0].idleComplete;

    // 이미 초기 유저 정보를 전부 입력한 거임
    if(checking === 1) {
        return true;
    }

    return false;
};