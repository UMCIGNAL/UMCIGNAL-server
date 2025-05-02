import { getPool } from "../../config/database/mysqlConnect";

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