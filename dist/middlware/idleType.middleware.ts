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

// 처음 이상형 찾는 로직
export const findIdleUser = async (
    gender: String,
    user_id: number,
    conn: PoolConnection
  ): Promise<{ findUser: foundUser, idleScore: number } | null> => {
    try {
      const findIdleQuery = `
        SELECT user_id, is_smoking, is_drinking, MBTI, student_major, instagram_id, age
        FROM user
        WHERE gender = ?;
      `;
  
      //나의 이상형 조회 쿼리
      const myIdleType = `SELECT idleType_id, user_id, idle_MBTI, age_gap, smoking_idle, drinking_idle FROM idleType WHERE user_id = ?;`;
  
      const [idleType]: any = await conn.query<RowDataPacket[]>(myIdleType, [user_id]);
  
      const myIdleCompare = idleType[0];
  
      // IdleType찾는 함수
      const [idleArray]:any = await conn.query<RowDataPacket[]>(findIdleQuery, [gender]);
      
      if (idleArray.length === 0) {
        return null; 
      }
  
      let idle_UserId: number;
      let idle_user: any;
      let isDuplicate: boolean;
      let isSameMajor: boolean;
      let attempts = 0;
      const MAX_ATTEMPTS = 15; // 무한 루프 방지
  
      do {
        if (attempts >= MAX_ATTEMPTS) {
          return null; // 최대 시도 횟수 초과하면 null 반환
        }
        
        const index = makeRandomIndex(idleArray.length);
        idle_user = idleArray[index];
        idle_UserId = idle_user.user_id;
  
        isDuplicate = await duplicateUser(user_id, idle_UserId, conn);
        isSameMajor = await avoidSameMajor(user_id, idle_UserId, conn);
        
        attempts++;
        
      } while (isDuplicate || isSameMajor); 
  
      const foundUser: foundUser = {
        user_id: idle_UserId,
        is_smoking: idle_user.is_smoking,
        is_drinking: idle_user.is_drinking,
        idle_MBTI: idle_user.MBTI,
        idle_major: idle_user.student_major,
        instagram_id: idle_user.instagram_id,
        idle_age: idle_user.age,
      };
  
      // 점수  계산 로직
      const idleScore = await scoreLatefunc(idle_user, myIdleCompare, conn);
  
      await addFoundUserTable(user_id, idle_UserId, conn);
  
      return { 
        findUser: foundUser,
        idleScore 
      };
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
): Promise<{ findUser: foundUser, idleScore: number } | number | null> => {
    try {
        const findIdleQuery = `
            SELECT user_id, is_smoking, is_drinking, MBTI, student_major, instagram_id, age
            FROM user
            WHERE gender = ?;
        `;

        // 내 이상형 테이블 불러오기
        const myIdleType = `SELECT idleType_id, user_id, idle_MBTI, age_gap, smoking_idle, drinking_idle FROM idleType WHERE user_id = ?;`;
        const [idleType]: any = await conn.query<RowDataPacket[]>(myIdleType, [user_id]);
        const myIdleCompare = idleType[0];

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

                const checkMajor = await avoidSameMajor(user_id, idle_UserId, conn);
                
                if(checkMajor) { // true라면 같은 전공이면 피해야함
                    continue;
                } 

                attempts++;
                if (attempts >= MAX_ATTEMPTS && isDuplicate) { // 더 이상 찾을 이상형이 없다면 기존 찾아진 회원에서 찾는 함수
                    
                    const duplicateUserResult = await findIdleTypeInTable(user_id, conn);
                    
                    if (duplicateUserResult && typeof duplicateUserResult === 'object' && 'findUser' in duplicateUserResult) {
                        const duplicateUser = duplicateUserResult.findUser;
                        const dupUserInfo = {
                            user_id: duplicateUser.user_id,
                            is_smoking: duplicateUser.is_smoking,
                            is_drinking: duplicateUser.is_drinking,
                            MBTI: duplicateUser.idle_MBTI,
                            student_major: duplicateUser.idle_major,
                            age: duplicateUser.idle_age
                        };
                        
                        const idleScore = await scoreLatefunc(dupUserInfo, myIdleCompare, conn);
                        
                        return {
                            findUser: duplicateUser,
                            idleScore
                        };
                    }
                    
                    return duplicateUserResult;
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
  
            const idleScore = await scoreLatefunc(idle_user, myIdleCompare, conn);
    
            await addFoundUserTable(user_id, idle_UserId, conn);
    
            return { 
                findUser: foundUser,
                idleScore
            };
        } else {
            return chanceToReroll; // 리롤 횟수를 모두 소진 시 그 수를 return
        }
    } catch (error) {
        console.error("Error in reroll:", error);
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


export const scoreLatefunc = async (
    idle_user: any,
    myIdleCompare: any,
    conn?: PoolConnection
  ): Promise<number> => {
    try {
      let score = 100; // 100으로 시작 차감으로
      
      if (myIdleCompare.idle_MBTI && idle_user.MBTI) {
        if (myIdleCompare.idle_MBTI.length === 4 && idle_user.MBTI.length === 4) {
          for (let i = 0; i < 4; i++) {
            if (myIdleCompare.idle_MBTI[i] !== idle_user.MBTI[i]) {
              score -= 6; // 각 문자마다 파싱해서 다르면 5점 삭감
            }
          }
        } else if (myIdleCompare.idle_MBTI !== idle_user.MBTI) {
          score -= 24;
        }
      }
      
 
      if (myIdleCompare.smoking_idle !== null && idle_user.is_smoking !== null) {
        if (myIdleCompare.smoking_idle !== idle_user.is_smoking) {
          score -= 18;
        }
      }
      
      if (myIdleCompare.drinking_idle !== null && idle_user.is_drinking !== null) {
        if (myIdleCompare.drinking_idle !== idle_user.is_drinking) {
          score -= 17;
        }
      }
      
      if (myIdleCompare.age_gap !== null && idle_user.age !== null) {
        const myAge = await getUserAge(myIdleCompare.user_id, conn);
        
        if (
          (myIdleCompare.age_gap === 0 && idle_user.age >= myAge) || 
          (myIdleCompare.age_gap === 1 && idle_user.age !== myAge) || 
          (myIdleCompare.age_gap === 2 && idle_user.age <= myAge)    
        ) {
          score -= 16;
        }
      }
      
      if (idle_user.student_major) {
        const avoidedMajorsQuery = `
          SELECT major_name FROM idle_major 
          WHERE idleType_id = ? AND major_name = ?;
        `;
        
        if (conn) {
          const [avoidedMajors]: any = await conn.query(avoidedMajorsQuery, [myIdleCompare.idleType_id, idle_user.student_major]);
          
          if (avoidedMajors && avoidedMajors.length > 0) {
            score -= 25;
          }
        }
      }
      
      
      // 만약 점수가 0 또는 100 이상으로 갔을 경우
      return Math.max(0, Math.min(100, score));
    } catch (error) {
      console.error("Error in scoreLatefunc:", error);
      throw error;
    }
  };
  
  // 나이 검색 로직
  const getUserAge = async (
    userId: number, 
    conn?: PoolConnection
  ): Promise<number> => {
    if (!conn) return 0;
    
    try {
      const ageQuery = `SELECT age FROM user WHERE user_id = ?;`;
      const [result]: any = await conn.query(ageQuery, [userId]);
      
      if (result && result.length > 0) {
        return result[0].age;
      }
      return 0;
    } catch (error) {
      console.error("Error fetching user age:", error);
      return 0;
    }
  };

  const avoidSameMajor = async (
    userId : number,
    idleUserId : number,
    conn : PoolConnection
  ):Promise<boolean> => {
      try {

        const checkQuery = `SELECT sameMajor FROM idleType WHERE user_id = ?;`;

        const [check] : any = await conn.query(checkQuery, [userId]);
        
        const result = check[0].sameMajor;

        if(!result) {
          return false;
        }

        const myMajorQuery = `SELECT student_major FROM user WHERE user_id =?;`;
        const idleMajorQuery = `SELECT student_major FROM user WHERE user_id =?;`;

        const [myMajorResult]:any = await conn.query(myMajorQuery, [userId]);
        const [idleMajorResult]:any = await conn.query(idleMajorQuery, [idleUserId]);

        const myMajor = myMajorResult[0]?.student_major;
        const idleMajor = idleMajorResult[0]?.student_major;

        return myMajor === idleMajor;
      } catch (error) {
        console.error("Error matching");
        return false;
      }
  };