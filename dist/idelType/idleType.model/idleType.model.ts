import { getPool } from "../../config/database/mysqlConnect";
import { addIdleType } from "../idleType.dto/idleType.dto";


export const addIdleTypeModel = async (
    user_id : number,
    idleType : addIdleType
): Promise<void> => {
    const pool = await getPool();
    const conn = await pool.getConnection();

    try {
        await conn.beginTransaction();

        const [usercheck] : any = await conn.query(
            `SELECT user_id FROM user WHERE user_id = ?;`, [user_id]
        );

        if (usercheck.length === 0) {
            throw new Error(`유효하지 않은 ${user_id}입니다.`);
        }

        const query = `
            INSERT INTO idleType (user_id, idle_MBTI, age_gap, smoking_idle, drinking_idle)
            VALUES (?, ?, ?, ?, ?)
            ON DUPLICATE KEY UPDATE 
                idle_MBTI = VALUES(idle_MBTI),
                age_gap = VALUES(age_gap),
                smoking_idle = VALUES(smoking_idle),
                drinking_idle = VALUES(drinking_idle);
        `;
    
        await conn.query(query, [
            user_id,  // user_id 추가
            idleType.idle_MBTI,
            idleType.age_gap,
            idleType.smoking_idle,
            idleType.drinking_idle,
        ]);    
    
        const [majorTableId]: any = 
            await conn.query(
                `SELECT idleType_id FROM idleType WHERE user_id = ?;`, [user_id]
        );
    
        if (majorTableId.length === 0) {
            throw new Error("idleType_id 조회 실패");  
        } 

        const idleTypeId = majorTableId[0].idleType_id;

        console.log("idleTypeId : ", idleTypeId);

        const add_major = 
        `INSERT INTO idle_major (idleType_id, major_name)
            VALUES (?, ?)
            ON DUPLICATE KEY UPDATE major_name = VALUES(major_name);`;

        console.log("나옴");

        for (const major of idleType.major_idle) {
            console.log("major : ", major);
            await conn.query(add_major, [idleTypeId, major]);
        }

        await conn.commit();

    } catch (error) {
        if(conn) {
            await conn.rollback();
        }
        console.error(error);
    } finally {
        if(conn) {
            conn.release();
        }
    }
};
