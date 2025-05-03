import { idealInfo } from "../frontFunc/frontFunc.DTO/frontFunc.DTO";
import { RowDataPacket } from "mysql2";
import { addFoundUserTable, duplicateUser, makeRandomIndex, rerollCount } from "./idleType.middleware";
import { PoolConnection } from "mysql2/promise";


// frontreroll 함수
export const frontReroll = async (
    gender: String,
    user_id: number,
    conn: PoolConnection
  ): Promise<{ findUser: idealInfo } | number | null> => {
    try {
        const findIdleQuery = `
            SELECT instagram_id
            FROM user
            WHERE gender = ?;
        `;

        const [idleArray]:any = await conn.query<RowDataPacket[]>(findIdleQuery, [gender]);
  
        if (idleArray.length === 0) {
            return null; 
        }
  
        let idle_UserId: number;
        let idle_user: any;
        let isDuplicate: boolean;
        let isSignUp: boolean;
        let attempts = 0;
        const MAX_ATTEMPTS = 15; // 무한 루프 방지
  
        const chanceToReroll = await rerollCount(user_id, conn);
  
        if(chanceToReroll > 0) {
            do {
                const index = makeRandomIndex(idleArray.length);
                idle_user = idleArray[index];
                idle_UserId = idle_user.user_id;
    
                isDuplicate = await duplicateUser(user_id, idle_UserId, conn);
                isSignUp = await checkSignUp(idle_UserId, conn);
                
                attempts++;
                if (attempts >= MAX_ATTEMPTS && (isDuplicate || isSignUp)) { // 최대 시도 후에도 중복이거나 같은 전공이면
                    // 기존 찾아진 회원에서 찾는 함수
                    const duplicateUserResult = await frontfindIdleTypeInTable(user_id, conn);
                    
                    if (duplicateUserResult && typeof duplicateUserResult === 'object' && 'findUser' in duplicateUserResult) {
                        const duplicateUser = duplicateUserResult.findUser;
                                                                        
                        return {
                            findUser: duplicateUser
                        };
                    }
                    
                    return duplicateUserResult;
                }
            } while (isDuplicate || isSignUp); // 중복이거나 같은 전공이면 계속 반복
    
            const foundUser: idealInfo = {
                instagram_id : idle_user.instagram_id
            };
      
            await addFoundUserTable(user_id, idle_UserId, conn);
    
            return { 
                findUser: foundUser
            };
        } else {
            return chanceToReroll; // 리롤 횟수를 모두 소진 시 그 수를 return
        }
    } catch (error) {
        console.error("Error in reroll:", error);
        throw error; 
    }
  };

  const checkSignUp = async(
    idle_user_id : number,
    conn : PoolConnection
  ):Promise<boolean> => {
      const query = `SELECT signUpComplete FROM user WHERE user_id = ?;`;

      const [useQuery] : any = await conn.query(query, [idle_user_id]);

      const check = useQuery[0].signUpComplete;

      console.log(check);

      if(check === 1) { // 이미 입력한 것임
        return false;
      } else {
        return true; // 입력 X
      }
  };


const frontfindIdleTypeInTable = async (
    user_id : number,
    conn : PoolConnection
):Promise<{ findUser: idealInfo }> => {
    const friend_result = `SELECT friend_id FROM found_User WHERE user_id =?;`;

    const [result]:any = await conn.query(friend_result, [user_id]);

    const index = makeRandomIndex(result.length); // 배열 값에서 랜덤으로 index 생성

    const idle_duplicate = result[index].friend_id; // index에서 이미 찾은 친구 id를 반환

    const findIdleQuery = `
            SELECT instagram_id
            FROM user
            WHERE user_id = ?;
        `;

    const [findResult]:any = await conn.query(findIdleQuery, [idle_duplicate]);
        
    const foundUser: idealInfo = {
        instagram_id: findResult[0].instagram_id,
    };

    return { findUser : foundUser };
};