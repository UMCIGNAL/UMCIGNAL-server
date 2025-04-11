import { getPool } from "../../config/database/mysqlConnect"


export const getRerollCountModel = async(
    user_id : number
):Promise<void> => {
    console.log("Model");
    const pool = await getPool();

    try {
        const query = `SELECT reroll FROM user WHERE user_id = ?;`;
    
        const [queryResult]:any = await pool.query(query, [user_id]);
    
        const rerollCount = queryResult[0].reroll;
    
        const updateQuery = `UPDATE user SET reroll = ? WHERE user_id = ?;`;
    
        await pool.query(updateQuery, [rerollCount+1, user_id]);
    } catch (error : any) {
        throw new Error(error);
    }
};