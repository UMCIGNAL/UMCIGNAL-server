import { getPool } from "../../config/database/mysqlConnect";
import { majorDTO } from "../search.dto/search.dto";

export const searchModel = async (
): Promise<string[]> => {
    const pool = await getPool();

    const query = 
    `SELECT *
     FROM college;`;

    const [rows] = await pool.query(query);

    return (rows as any[]).map((row: any) => row);
};

export const specificMajorModel = async (
    major_id: number
): Promise<majorDTO[]> => {
    const pool = await getPool();

    const query = 
    `SELECT major_id, major_name
     FROM major
     WHERE college_id = ?;`;

    const [rows] = await pool.query(query, [major_id]);

    return (rows as any[]).map(row => ({
        mojor_id : row.major_id,
        major_name : row.major_name
    }));
};