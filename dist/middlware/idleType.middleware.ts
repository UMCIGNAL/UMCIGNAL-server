import { ResultSetHeader, RowDataPacket } from "mysql2";
import { getPool } from "../config/database/mysqlConnect";
import { foundUser } from "../idelType/idleType.dto/idleType.dto";
import { PoolConnection } from "mysql2/promise";

export const makeRandomIndex = (
    size : number
) => {
    return Math.floor(Math.random() * (size));
};


// 성별 정의 함수
export const defineGender = async (
    user_id: number,
    conn: PoolConnection
): Promise<String> => {
    const gender_query = `SELECT gender FROM user WHERE user_id = ?;`;

  try {
    const [user_gender]: any = await conn.query(gender_query, [user_id]);

    if (!user_gender || user_gender.length === 0) {
      throw new Error('사용자를 찾을 수 없습니다.');
    }

    const gender = user_gender[0].gender;
    console.log("Gender search 1:", gender);

    return gender === 'male' ? 'female' : 'male';
  } catch (error) {
    console.error("Error in defineGender:", error);
    throw error;
  }
};

// 이상형 유저를 찾는 함수
export const findIdleUser = async (
    gender: String,
    user_id: number,
    conn: PoolConnection
): Promise<{ findUser: foundUser } | null> => {
    try {
        const findIdleQuery = `
            SELECT user_id, nickName, is_smoking, is_drinking, MBTI, student_major, instagram_id, age
            FROM user
            WHERE gender = ?
        `;

        // pool.query 대신 conn.query 사용
        const [idleArray]:any = await conn.query<RowDataPacket[]>(findIdleQuery, [gender]);
        console.log("Found users count:", idleArray.length);

        if (idleArray.length === 0) {
            return null; 
        }

        let idle_UserId: number;
        let idle_user: any;
        let isDuplicate: boolean;
        let attempts = 0;
        const MAX_ATTEMPTS = 15; // 무한 루프 방지

        do {
            const index = makeRandomIndex(idleArray.length);
            idle_user = idleArray[index];
            idle_UserId = idle_user.user_id;

            isDuplicate = await duplicateUser(user_id, idle_UserId, conn);
            
            attempts++;
            if (attempts >= MAX_ATTEMPTS && isDuplicate) {
                console.log("Maximum attempts reached, returning null");
                return null; 
            }
        } while (isDuplicate); 

        const foundUser: foundUser = {
            user_id: idle_UserId,
            nickName: idle_user.nickName,
            is_smoking: idle_user.is_smoking,
            is_drinking: idle_user.is_drinking,
            idle_MBTI: idle_user.MBTI,
            idle_major: idle_user.student_major,
            instagram_id: idle_user.instagram_id,
            idle_age: idle_user.age,
        };

        await addFoundUserTable(user_id, idle_UserId, conn);

        return { findUser: foundUser };
    } catch (error) {
        console.error("Error in findIdleUser:", error);
        throw error; 
    }
};


export const duplicateUser = async (
    my_id: number,
    idle_id: number,
    conn : PoolConnection
): Promise<boolean> => {
    try {
        const query = `
            SELECT 1 FROM found_User
            WHERE user_id = ? AND friend_id = ?
            LIMIT 1
        `;

        const [result] = await conn.query<RowDataPacket[]>(query, [my_id, idle_id]);
        return result.length > 0;
        
    } catch (error) {
        console.error("Error in duplicateUser:", error);
        throw error;
    }
};

export const addFoundUserTable = async (
    my_id : number,
    idle_id : number,
    conn : PoolConnection
):Promise<void> => {
    const query = 
    `INSERT INTO found_User (user_id, friend_id)
    VALUES (?, ?);
     `;

    await conn.query<ResultSetHeader>(query, [my_id, idle_id]);
};