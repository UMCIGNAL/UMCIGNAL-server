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

    if(gender === 'male') {
        return 'female';
    } else if(gender === 'female') {
        return 'male';    
    } else {
        return 'other';
    }
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
            SELECT user_id, is_smoking, is_drinking, MBTI, student_major, instagram_id, age
            FROM user
            WHERE gender = ?;
        `;

        // pool.query 대신 conn.query 사용
        const [idleArray]:any = await conn.query<RowDataPacket[]>(findIdleQuery, [gender]);
        
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



// reroll 함수
export const reroll = async (
    gender: String,
    user_id: number,
    conn: PoolConnection
): Promise<{ findUser: foundUser } | number | null> => {
    try {
        const findIdleQuery = `
            SELECT user_id, is_smoking, is_drinking, MBTI, student_major, instagram_id, age
            FROM user
            WHERE gender = ?;
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

        const chanceToReroll = await rerollCount(user_id, conn);

        if(chanceToReroll > 0) {
            do {
                const index = makeRandomIndex(idleArray.length);
                idle_user = idleArray[index];
                idle_UserId = idle_user.user_id;
    
                isDuplicate = await duplicateUser(user_id, idle_UserId, conn);
                
                attempts++;
                if (attempts >= MAX_ATTEMPTS && isDuplicate) { // 더 이상 찾을 이상형이 없다면 기존 찾아진 회원에서 찾는 함수
                    
                    const duplicateUser = await findIdleTypeInTable(user_id, conn);
                    return duplicateUser; 
                }
            } while (isDuplicate); 
    
            const foundUser: foundUser = {
                user_id: idle_UserId,
                is_smoking: idle_user.is_smoking,
                is_drinking: idle_user.is_drinking,
                idle_MBTI: idle_user.MBTI,
                idle_major: idle_user.student_major,
                instagram_id: idle_user.instagram_id,
                idle_age: idle_user.age,
            };
    
            await addFoundUserTable(user_id, idle_UserId, conn);
    
            return { findUser: foundUser };
        } else {
            return chanceToReroll; // 리롤 횟수를 모두 소진 시 그 수를 return
        }
    } catch (error) {
        console.error("Error in findIdleUser:", error);
        throw error; 
    }
};


export const rerollCount = async (
    user_id: number,
    conn: PoolConnection
): Promise<number> => {
    const selectQuery = `SELECT reroll FROM user WHERE user_id = ?;`;

    const [result]: any = await conn.query(selectQuery, [user_id]);

    const currentReroll = result[0].reroll;
    
    if (currentReroll === 0) return 0; // reroll 횟수가 0 이면 0 반환

    // reroll 값을 1 감소
    const updateQuery = `UPDATE user SET reroll = ? WHERE user_id = ?;`;
    await conn.query(updateQuery, [currentReroll - 1, user_id]);

    return currentReroll; 
};

// 찾아진 이상형 테이블에서 찾는 함수
export const findIdleTypeInTable = async (
    user_id : number,
    conn : PoolConnection
):Promise<{ findUser: foundUser }> => {
    const friend_result = `SELECT friend_id FROM found_User WHERE user_id =?;`;

    const [result]:any = await conn.query(friend_result, [user_id]);

    const index = makeRandomIndex(result.length); // 배열 값에서 랜덤으로 index 생성

    const idle_duplicate = result[index].friend_id; // index에서 이미 찾은 친구 id를 반환

    const findIdleQuery = `
            SELECT user_id, is_smoking, is_drinking, MBTI, student_major, instagram_id, age
            FROM user
            WHERE user_id = ?;
        `;

    const [findResult]:any = await conn.query(findIdleQuery, [idle_duplicate]);
        
    const foundUser: foundUser = {
        user_id: findResult[0].user_id,
        is_smoking: findResult[0].is_smoking,
        is_drinking: findResult[0].is_drinking,
        idle_MBTI: findResult[0].MBTI,
        idle_major: findResult[0].student_major,
        instagram_id: findResult[0].instagram_id,
        idle_age: findResult[0].age,
    };

    return { findUser: foundUser };
};