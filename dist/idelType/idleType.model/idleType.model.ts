import { RowDataPacket } from "mysql2";
import { getPool } from "../../config/database/mysqlConnect";
import { defineGender, findIdleUser, makeRandomIndex, reroll } from "../../middlware/idleType.middleware";
import { addIdleType, fixIdleType, foundUser } from "../idleType.dto/idleType.dto";


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
            INSERT INTO idleType (user_id, idle_MBTI, age_gap, smoking_idle, drinking_idle, sameMajor)
            VALUES (?, ?, ?, ?, ?, ?)
            ON DUPLICATE KEY UPDATE 
                idle_MBTI = VALUES(idle_MBTI),
                age_gap = VALUES(age_gap),
                smoking_idle = VALUES(smoking_idle),
                drinking_idle = VALUES(drinking_idle),
                sameMajor = VALUES(sameMajor);
        `;
    
        await conn.query(query, [
            user_id,  // user_id 추가
            idleType.idle_MBTI,
            idleType.age_gap,
            idleType.smoking_idle,
            idleType.drinking_idle,
            idleType.sameMajor,
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

        for (const major of idleType.major_idle) {
            console.log("major : ", major);
            await conn.query(add_major, [idleTypeId, major]);
        }

        const idleChangeToTrue = `UPDATE user SET idleComplete =? WHERE user_id = ?;`;

        await conn.query(idleChangeToTrue, [true ,user_id]);

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


export const fixIdleTypeModel = async (
    user_id: number,
    idleType: fixIdleType
): Promise<void> => {
    const pool = await getPool();
    const conn = await pool.getConnection();

    try {
        await conn.beginTransaction();

        const idleQuery = 
        `SELECT idleType_id FROM idleType
        WHERE user_id = ?;`;

        const [idle_Table_id]:any = await conn.query(idleQuery, [user_id]);

        if (!(idle_Table_id.length > 0)) {
            throw new Error("이상형 테이블 id가 없습니다.");
        }

        const idleTypeId = idle_Table_id[0].idleType_id;

        
        if (idleType.idle_MBTI) {
            const query = `UPDATE idleType SET idle_MBTI = ? WHERE user_id = ?`;
            await conn.query(query, [idleType.idle_MBTI, user_id]);
        }

        if (idleType.age_gap !== undefined) {
            const query = `UPDATE idleType SET age_gap = ? WHERE user_id = ?`;
            await conn.query(query, [idleType.age_gap, user_id]);
        }

        if (idleType.smoking_idle !== undefined) {
            const query = `UPDATE idleType SET smoking_idle = ? WHERE user_id = ?`;
            await conn.query(query, [idleType.smoking_idle, user_id]);
        }

        if (idleType.drinking_idle !== undefined) {
            const query = `UPDATE idleType SET drinking_idle = ? WHERE user_id = ?`;
            await conn.query(query, [idleType.drinking_idle, user_id]);
        }


        // 1. 기존 전공 삭제
        if (idleType.major_idle && idleType.major_idle.length > 0) {
            const deleteQuery = `DELETE FROM idle_major WHERE idleType_id = ?;`;
            await conn.query(deleteQuery, [idleTypeId]);
        }
        
        // 2. 새로운 전공 삽입
        if (idleType.major_idle && idleType.major_idle.length > 0) {
            const insertQuery = 
            `INSERT INTO idle_major (idleType_id, major_name)
            VALUES (?, ?)
            ON DUPLICATE KEY UPDATE major_name = VALUES(major_name);`;
        
            for (const major of idleType.major_idle) {
                await conn.query(insertQuery, [idleTypeId, major]);
            }
        }

        await conn.commit();

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


export const findIdleTypeModel = async(
    user_id: number
): Promise<{ findUser: foundUser } | null> => {
    const pool = await getPool();
    const conn = await pool.getConnection();

    try {
        await conn.beginTransaction();

        
        const gender = await defineGender(user_id, conn);

        const result = await findIdleUser(gender, user_id, conn);

        if (!result) {
            throw new Error("이상형 유저를 찾을 수 없습니다.");
        }

        await conn.commit();

        return result;
    } catch (error) {
        console.error("Error in findIdleTypeModel:", error);
        await conn.rollback();
        return null;
    } finally {
        await conn.release();
    }
};

export const rerollModel = async(
    user_id: number
):Promise<{findUser: foundUser} | number | null> => {
    const pool = await getPool();
    const conn = await pool.getConnection();

    try {
        await conn.beginTransaction();

        
        const gender = await defineGender(user_id, conn);

        const result = await reroll(gender, user_id, conn);

        if (!result && result !== 0) {
            await conn.rollback();
            return null;        
        } else if(result === 0) {
            await conn.rollback();
            return 0;
        }

        await conn.commit();

        return result;
    } catch (error) {
        console.error("Error in findIdleTypeModel:", error);
        await conn.rollback();
        return null;
    } finally {
        await conn.release();
    }
};