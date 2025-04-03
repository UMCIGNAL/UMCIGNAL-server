import { getPool } from "../../config/database/mysqlConnect";

export const insertCodeModel = async (
    user_id : number,
    serialCode : String
):Promise<any> => {
    const pool = await getPool();
    const conn = await pool.getConnection();

    try {
        await conn.beginTransaction(); 

        const query = 'SELECT code FROM serialCode WHERE code = ?';
    
        const [result]:any = await conn.query(query, [serialCode]);
    
        if(result.lenght === 0) {
            return 0;
        } else {
            const change_query = `UPDATE serialCode SET userAgeCheck = 1 WHERE code = ?`;
            await conn.query(change_query, [serialCode]);

            const getQuery = `SELECT reroll FROM user WHERE user_id = ?`;
            const [rerollCount]:any = await conn.query(getQuery, [user_id]);

            const setQuery = 'UPDATE user SET reroll = ? WHERE user_id = ?';
            
            await conn.query(setQuery, [rerollCount[0].reroll +3, user_id]);
            
            await conn.commit();

            return 1;
        }
    } catch (error) {
        if (conn) {
            await conn.rollback();
        }
        console.error(error);
    } finally {
        if (conn) {
            conn.release();
        }
    }
    
};