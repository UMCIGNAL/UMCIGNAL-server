import { getPool } from "../../config/database/mysqlConnect";

export const searchModel = async (
    keyword : string
): Promise<string[]> => {
    const pool = await getPool();

    const query = 
    `SELECT major_name
     FROM major_table
     WHERE major_name LIKE ?;`;

    const [rows] = await pool.execute(query, [`%${keyword}%`]);

    return (rows as any[]).map((row: any) => row.major_name);
};