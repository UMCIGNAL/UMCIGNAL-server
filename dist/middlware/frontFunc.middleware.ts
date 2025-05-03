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
        const chanceToReroll = await rerollCount(user_id, conn);
        
        if(chanceToReroll <= 0) {
            return chanceToReroll; // 리롤 횟수를 모두 소진 시 그 수를 return
        }
        
        // 이미 찾은 사용자들 목록 가져오기 (중복 체크용)
        const foundUserQuery = `
            SELECT friend_id
            FROM found_User
            WHERE user_id = ?;
        `;
        const [foundUsers]: any = await conn.query(foundUserQuery, [user_id]);
        const foundUserIds = foundUsers.map((user: any) => user.friend_id);
        
        // 자기 자신 제외
        foundUserIds.push(user_id);
        
        // 성별에 맞는 사용자 중 signUpComplete가 1이고 아직 찾지 않은 사용자만 조회
        const findIdleQuery = `
            SELECT user_id, instagram_id
            FROM user
            WHERE gender = ?
            AND signUpComplete = 1
            AND user_id NOT IN (${foundUserIds.length > 0 ? foundUserIds.join(',') : '0'});
        `;

        const [idleArray]: any = await conn.query<RowDataPacket[]>(findIdleQuery, [gender]);
  
        // 새로운 이상형 없음 - 기존 찾은 사용자 중에서 선택
        if (idleArray.length === 0) {
            return await frontfindIdleTypeInTable(user_id, conn, gender);
        }
  
        // 랜덤으로 선택 (한 번에 하나만 선택)
        const index = makeRandomIndex(idleArray.length);
        const idle_user = idleArray[index];
        const idle_UserId = idle_user.user_id;
    
        // 찾은 사용자 정보 저장
        await addFoundUserTable(user_id, idle_UserId, conn);
    
        const foundUser: idealInfo = {
            instagram_id: idle_user.instagram_id
        };
    
        return { 
            findUser: foundUser
        };
        
    } catch (error) {
        console.error("Error in reroll:", error);
        throw error; 
    }
};

// 찾아진 사용자 중에서 선택하는 함수
const frontfindIdleTypeInTable = async (
    user_id: number,
    conn: PoolConnection,
    gender?: String
): Promise<{ findUser: idealInfo } | null> => {
    try {
        // 이미 찾은 친구 중에서 검색하는 쿼리 (조건: 해당 성별, signUpComplete=1)
        const friend_result = `
            SELECT f.friend_id, u.instagram_id
            FROM found_User f
            JOIN user u ON f.friend_id = u.user_id
            WHERE f.user_id = ?
            AND u.signUpComplete = 1
            ${gender ? 'AND u.gender = ?' : ''};
        `;

        const queryParams = gender ? [user_id, gender] : [user_id];
        const [result]: any = await conn.query(friend_result, queryParams);

        if (result.length === 0) {
            // 성별 필터 제거하고 다시 시도
            if (gender) {
                return await frontfindIdleTypeInTable(user_id, conn);
            }
            return null; // 이미 찾은 유저 중 조건에 맞는 사용자가 없음
        }

        const index = makeRandomIndex(result.length); // 배열 값에서 랜덤으로 index 생성
        
        const foundUser: idealInfo = {
            instagram_id: result[index].instagram_id,
        };

        return { findUser: foundUser };
    } catch (error) {
        console.error("Error in frontfindIdleTypeInTable:", error);
        throw error;
    }
};