import { getPool } from "../../config/database/mysqlConnect";

export const searchModel = async (
): Promise<string[]> => {
    const pool = await getPool();

    const query = 
    `SELECT *
     FROM college;`;

    const [rows] = await pool.execute(query);

    return (rows as any[]).map((row: any) => row);
};