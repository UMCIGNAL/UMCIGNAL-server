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
    
        if(!result[0]) {
            return 0;
        } else {
            const check_query = `SELECT userAgeCheck FROM serialCode WHERE code = ?;`;

            const [comfirmation]:any = conn.query(check_query, [serialCode]);

            const checking = comfirmation[0].userAgeCheck;
            console.log(checking);

            if(checking === 1) {
                return 2;
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


export const myRerollModel = async (
    user_id : number
): Promise<number> => {
    const pool = await getPool();

    const query = `SELECT reroll FROM user WHERE user_id = ?`;

    const [reroll]:any = await pool.query(query, [user_id]);

    return reroll[0].reroll;
};